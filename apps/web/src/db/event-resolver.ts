import { EventDataSchema, type EventData } from "@evnt/schema";
import { UtilEventSource, type EventSource } from "./models/event-source";
import { DataDB } from "./data-db";
import { Client, simpleFetchHandler, type FailedClientResponse } from "@atcute/client";
import { parseCanonicalResourceUri, type Did } from "@atcute/lexicons/syntax";
import type { EventEnvelope } from "./models/event-envelope";
import { tryCatch, tryCatchAsync } from "../lib/util/trynull";
import { ZodError } from "zod";
import { didDocumentResolver } from "../lib/atproto/atproto-services";
import { getPdsEndpoint } from "@atcute/identity";

export class EventResolver {
	static async resolve(source: EventSource): Promise<EventEnvelope> {
		const cached = await DataDB.get(source);
		if (UtilEventSource.isLocal(source) && cached != null) return cached;
		if (cached != null) return cached;
		// the code below causes an infinite loop!

		// if (cached != null && !!cached.data && !cached.err) {
		// 	const updated = await this.#update(source, cached);
		// 	console.log(`EventResolver: resolved event source ${source} from cache, updated: ${updated != null}`);
		// 	if (updated != null) await DataDB.put(source, updated);
		// 	if (updated != null) return updated;
		// };
		const envelope = await this.#fetch(source);
		await DataDB.put(source, envelope);
		console.log(`EventResolver: resolved event source ${source} from network, success: ${!!envelope.data}, err: ${!!envelope.err}`);
		return envelope;
	}

	static async update(source: EventSource) {
		const cached = await DataDB.get(source);
		if (!cached) return;
		if (UtilEventSource.isLocal(source)) return;
		const updated = await this.#update(source, cached);
		console.log(`EventResolver: updated event source ${source} from network, success: ${!!updated?.data}, err: ${!!updated?.err}`);
		if (updated) await DataDB.put(source, updated);
		else await DataDB.put(source, await this.#fetch(source));
	}

	static async #fetch(source: EventSource): Promise<EventEnvelope> {
		if (UtilEventSource.isHttp(source) || UtilEventSource.isHttps(source)) {
			return await this.#fetchHttp(source);
		} else if (UtilEventSource.isAt(source)) {
			return await this.#fetchAtProto(source);
		} else if (UtilEventSource.isLocal(source)) {
			throw new Error(`Cannot fetch local event source: ${source}`);
		} else {
			throw new Error(`Unsupported event source: ${source}`);
		}
	}

	static async #update(source: EventSource, envelope: EventEnvelope): Promise<EventEnvelope | null> {
		if (UtilEventSource.isHttp(source) || UtilEventSource.isHttps(source)) {
			return await this.#updateHttp(source, envelope);
		};

		return null;
	}

	static async #updateHttp(source: EventSource.Http | EventSource.Https, envelope: EventEnvelope): Promise<EventEnvelope | null> {
		const etag = envelope.rev?.etag;
		if (etag) {
			const [res, fetchError] = await tryCatchAsync(() => fetch(source, {
				headers: [
					["If-None-Match", etag],
				],
			}));

			if (fetchError) return {
				data: null,
				err: this.#EnvelopeError(fetchError as TypeError),
			};

			const notModified = res.status === 304;
			if (notModified) return envelope;

			return {
				...envelope,
				...await this.fromResponse(res),
			};
		}

		return null;
	}

	static async #fetchHttp(source: EventSource.Http | EventSource.Https): Promise<EventEnvelope> {
		const [res, fetchError] = await tryCatchAsync(() => fetch(source));
		if (fetchError) {
			return {
				data: null,
				err: this.#EnvelopeError(fetchError as TypeError),
			};
		};

		return await this.fromResponse(res);
	}

	static async fromResponse(res: Response): Promise<EventEnvelope> {
		if (!res.ok) {
			return {
				data: null,
				err: this.#EnvelopeError(res),
			};
		};

		const [json, jsonParseError] = await tryCatchAsync(() => res.json());
		if (jsonParseError) {
			return {
				data: null,
				err: this.#EnvelopeError(jsonParseError as SyntaxError),
			};
		};

		const envelope = this.fromJsonObject(json);

		console.log(`EventResolver: headers`, [...res.headers.entries()]);

		return {
			...envelope,
			rev: {
				etag: res.headers.get("ETag") ?? undefined,
			},
		};
	}

	static fromJsonText(jsontext: string): EventEnvelope {
		const [json, jsonParseError] = tryCatch(() => JSON.parse(jsontext));
		if (jsonParseError) {
			return {
				data: null,
				err: this.#EnvelopeError(jsonParseError as SyntaxError),
			};
		}

		return this.fromJsonObject(json);
	}

	static fromJsonObject(json: unknown): EventEnvelope {
		const result = EventDataSchema.safeParse(json);

		if (!result.success) {
			return {
				data: null,
				err: this.#EnvelopeError(result.error),
			};
		}

		return {
			data: result.data,
		};
	}

	static async #fetchAtProto(source: EventSource.At): Promise<EventEnvelope> {
		const parsed = parseCanonicalResourceUri(source);
		if (!parsed.ok) throw new Error(`Invalid at-uri: ${parsed.error}`);

		const didDocument = await didDocumentResolver.resolve(parsed.value.repo as Did<"plc" | "web">);
		const pds = getPdsEndpoint(didDocument) ?? "https://bsky.social";

		const rpc = new Client({
			handler: simpleFetchHandler({
				service: pds,
			}),
		});

		const [res, fetchError] = await tryCatchAsync(() => rpc.get("com.atproto.repo.getRecord", {
			params: {
				repo: parsed.value.repo,
				collection: parsed.value.collection,
				rkey: parsed.value.rkey,
			},
		}));

		if (fetchError) {
			return {
				data: null,
				err: this.#EnvelopeError(fetchError as TypeError),
			}
		}

		if (!res.ok) {
			return {
				data: null,
				err: this.#EnvelopeError(res),
			};
		}

		const result = EventDataSchema.safeParse(res.data.value);

		if (!result.success) {
			return {
				data: null,
				err: this.#EnvelopeError(result.error),
			};
		}

		return {
			data: result.data,
			rev: {
				cid: res.data.cid,
			},
		};
	}

	static #EnvelopeError(err: TypeError | SyntaxError | Response | ZodError | FailedClientResponse): EventEnvelope.Error {
		if (err instanceof TypeError) return {
			kind: "fetch",
			message: err.message,
		};

		if (err instanceof SyntaxError) return {
			kind: "json-parse",
			message: err.message,
		};

		if (err instanceof Response) return {
			kind: "fetch",
			message: `HTTP error: ${err.status} ${err.statusText}`,
			status: err.status,
			// maybe body too?
		};

		if (err instanceof ZodError) return {
			kind: "validation",
			issues: err.issues,
		};

		// Plain object territory

		if (!err.ok && err.data) return {
			kind: "xrpc",
			error: err.data.error,
			message: err.data.message,
			status: err.status,
		}

		throw new Error(`Unreachable`);
	}
}

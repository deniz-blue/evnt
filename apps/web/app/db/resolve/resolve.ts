import { EventDataSchema, type EventData } from "@evnt/schema";
import { UtilEventSource, type EventSource } from "../../db/models/event-source";
import { DataDB } from "../../db/data-db";
import { Client, simpleFetchHandler, type FailedClientResponse } from "@atcute/client";
import { parseCanonicalResourceUri } from "@atcute/lexicons/syntax";
import type { EventEnvelope } from "../models/event-envelope";
import { tryCatchAsync } from "../../lib/util/trynull";
import { ZodError } from "zod";

export class EventResolver {
	static async resolve(source: EventSource): Promise<EventEnvelope> {
		const cached = await DataDB.get(source);
		if (cached != null) return cached;
		const envelope = await this.#fetch(source);
		await DataDB.put(source, envelope);
		return envelope;
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

	static async #fetchHttp(source: EventSource.Http | EventSource.Https): Promise<EventEnvelope> {
		const [res, fetchError] = await tryCatchAsync(() => fetch(source));
		if (fetchError) {
			return {
				data: null,
				err: this.#EnvelopeError(fetchError as TypeError),
			};
		};

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

		const result = EventDataSchema.safeParse(json);

		if (!result.success) {
			return {
				data: null,
				err: this.#EnvelopeError(result.error),
			};
		};

		return {
			data: result.data,
			rev: {
				etag: res.headers.get("etag") ?? undefined,
			},
		};
	}

	static async fromJsonText(jsontext: string): Promise<EventEnvelope> {
		const [json, jsonParseError] = await tryCatchAsync(() => JSON.parse(jsontext));
		if (jsonParseError) {
			return {
				data: null,
				err: this.#EnvelopeError(jsonParseError as SyntaxError),
			};
		}

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

		const rpc = new Client({
			handler: simpleFetchHandler({
				service: "https://bsky.social",
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

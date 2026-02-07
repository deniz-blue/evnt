import { isCanonicalResourceUri, type CanonicalResourceUri, type Did, type Nsid, type RecordKey } from "@atcute/lexicons";
import z from "zod";

export namespace EventSource {
	export type Type = "local" | "http" | "https" | "at";
	export type Local = `local://${string}`;
	export type Http = `http://${string}`;
	export type Https = `https://${string}`;
	export type At = CanonicalResourceUri;
};

export type EventSource = `${"local" | "http" | "https"}://${string}` | CanonicalResourceUri;

export const EventDataSourceSchema = z.union([
	z.url({ protocol: /^(https?)$/ }) as z.ZodType<`${"http" | "https"}://${string}`>,
	z.string().refine(s => isCanonicalResourceUri(s), { message: "Invalid at URI" }),
]);

export const EventDataSourceWithLocalSchema = z.union([
	EventDataSourceSchema,
	z.string().refine(s => s.startsWith("local://"), { message: "Invalid local URI" }) as z.ZodType<EventSource.Local>,
]);

export class UtilEventSource {
	static is(str: string, client: boolean): str is EventSource {
		try {
			(client ? EventDataSourceWithLocalSchema : EventDataSourceSchema).parse(str);
			return true;
		} catch {
			return false;
		}
	}

	static local(uuid: string): EventSource.Local {
		return `local://${uuid}`;
	}

	static localRandom(): EventSource.Local {
		return this.local(crypto.randomUUID());
	}

	static https(url: string): EventSource.Https {
		return `https://${url}`;
	}

	static at(did: Did, collection: Nsid, rkey: RecordKey): EventSource.At {
		return `at://${did}/${collection}/${rkey}`;
	}

	static isAt(source: EventSource): source is EventSource.At {
		return source.startsWith("at://");
	}

	static isHttp(source: EventSource): source is EventSource.Http {
		return source.startsWith("http://");
	}

	static isHttps(source: EventSource): source is EventSource.Https {
		return source.startsWith("https://");
	}

	static isLocal(source: EventSource): source is EventSource.Local {
		return source.startsWith("local://");
	}

	static isFromNetwork(source: EventSource): source is EventSource.Http | EventSource.Https | EventSource.At {
		return source.startsWith("http://")
			|| source.startsWith("https://")
			|| source.startsWith("at://");
	}

	static getType(source: EventSource): EventSource.Type {
		return source.split("://", 1)[0] as EventSource.Type;
	}

	static fromOld(source: { type: "local"; uuid: string } | { type: "remote"; url: string }): EventSource {
		if (source.type === "local") {
			return this.local(source.uuid);
		} else {
			return source.url as EventSource;
		}
	}
};


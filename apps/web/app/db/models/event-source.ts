import { isCanonicalResourceUri, type CanonicalResourceUri, type Did, type Nsid, type RecordKey } from "@atcute/lexicons";
import z from "zod";

export type EventDataSourceType = "local" | "http" | "https" | "at";
export type EventDataSource = `${"local" | "http" | "https"}://${string}` | CanonicalResourceUri;
export const EventDataSourceSchema = z.union([
	z.url({ protocol: /^(https?|local)$/ }) as z.ZodType<`${"http" | "https" | "local"}://${string}`>,
	z.string().refine(s => isCanonicalResourceUri(s), { message: "Invalid at URI" }),
]);

export class UtilEventSource {
	static is(str: string): str is EventDataSource {
		try {
			EventDataSourceSchema.parse(str);
			return true;
		} catch {
			return false;
		}
	}

	static as(str: string): EventDataSource {
		return EventDataSourceSchema.parse(str);
	}

	static local(uuid: string): EventDataSource {
		return `local://${uuid}`;
	}

	static localRandom(): EventDataSource {
		return this.local(crypto.randomUUID());
	}

	static https(url: string): EventDataSource {
		return `https://${url}`;
	}

	static at(did: Did, collection: Nsid, rkey: RecordKey): EventDataSource {
		return `at://${did}/${collection}/${rkey}`;
	}

	static isFromNetwork(source: EventDataSource): boolean {
		return source.startsWith("http://")
			|| source.startsWith("https://")
			|| source.startsWith("at://");
	}

	static getType(source: EventDataSource): EventDataSourceType {
		return source.split("://", 1)[0] as EventDataSourceType;
	}

	static fromOld(source: { type: "local"; uuid: string } | { type: "remote"; url: string }): EventDataSource {
		if (source.type === "local") {
			return this.local(source.uuid);
		} else {
			return source.url as EventDataSource;
		}
	}
};


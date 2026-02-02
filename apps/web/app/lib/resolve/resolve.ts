import { EventDataSchema, type EventData } from "@evnt/schema";
import { UtilEventSource, type EventDataSource } from "../../db/models/event-source";
import { DataDB } from "../../db/data-db";
import { fetchValidate } from "../util/fetchValidate";
import { Client, simpleFetchHandler } from "@atcute/client";
import { parseCanonicalResourceUri } from "@atcute/lexicons/syntax";

export class EventDataResolver {
	static async getDataWithCache(source: EventDataSource): Promise<EventData> {
		const cached = await DataDB.get(source);
		if (cached != null) return cached.data;
		const data = await this.fetch(source);
		await DataDB.put(source, { data });
		return data;
	}

	static async fetch(source: EventDataSource): Promise<EventData> {
		switch (UtilEventSource.getType(source)) {
			case "local":
				throw new Error("Cannot fetch data for local event source");
			case "http":
			case "https":
				return await this.fetchRemote(source);
			case "at":
				return await this.fetchAtProto(source);
		}
	}

	static async fetchRemote(url: string): Promise<EventData> {
		const [data, error] = await fetchValidate(url, EventDataSchema);
		if (error) throw error;
		return data;
	}

	static async fetchAtProto(uri: string): Promise<EventData> {
		const parsed = parseCanonicalResourceUri(uri);
		if (!parsed.ok) throw new Error(`Invalid at-uri: ${parsed.error}`);

		const rpc = new Client({
			handler: simpleFetchHandler({
				service: "https://bsky.social",
			}),
		});

		const res = await rpc.get("com.atproto.repo.getRecord", {
			params: {
				repo: parsed.value.repo,
				collection: parsed.value.collection,
				rkey: parsed.value.rkey,
			},
		});

		if (!res.ok) throw new Error(res.data.message || res.data.error || "Failed to fetch at-uri record");

		const data = EventDataSchema.parse(res.data.value);

		return data;
	}
}

import { $NSID, type EventData } from "@evnt/schema";
import { UtilEventSource, type EventSource } from "./models/event-source";
import { useATProtoAuthStore } from "../lib/atproto/useATProtoStore";
import { parseCanonicalResourceUri } from "@atcute/lexicons";
import { DataDB } from "./data-db";
import type { Records } from "@atcute/lexicons/ambient";

export class EventMutator {
	static async update(source: EventSource, data: EventData): Promise<void> {
		if (UtilEventSource.isLocal(source)) {
			await this.updateLocal(source, data);
		} else if (UtilEventSource.isAt(source)) {
			await this.updateAtProto(source, data);
		} else {
			throw new Error(`Unsupported event source for update: ${source}`);
		}
	}

	static async updateLocal(source: EventSource.Local, data: EventData): Promise<void> {
		await DataDB.put(source, { data });
	}

	static async updateAtProto(source: EventSource.At, data: EventData): Promise<void> {
		const { rpc } = useATProtoAuthStore.getState();
		if (!rpc) throw new Error("Not authenticated with ATProto");
		const parseRes = parseCanonicalResourceUri(source);
		if (!parseRes.ok) throw new Error("Invalid ATProto URI");
		const { repo, collection, rkey } = parseRes.value;
		console.log("Updating ATProto event", { source, data, repo, collection, rkey });
		await rpc.post("com.atproto.repo.putRecord", {
			input: {
				collection,
				repo,
				rkey,
				record: {
					"$type": $NSID,
					...data,
				} as Records[typeof $NSID],
			},
		});
		DataDB.emitUpdate(source);
	}
}

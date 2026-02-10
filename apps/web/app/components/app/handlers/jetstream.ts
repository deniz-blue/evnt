import { JetstreamSubscription, type CommitEvent } from "@atcute/jetstream";
import { BlueDenizEvent, LOCALSTORAGE_KEYS } from "../../../constants";
import { Logger } from "../../../lib/util/logger";
import { UtilEventSource, type EventSource } from "../../../db/models/event-source";

const JetstreamLogger = Logger.main.styledChild("Jetstream", "#88c0d0");

export const createJetstream = ({

}: {
	onCommit?: (source: EventSource.At, record: object, event: CommitEvent) => void;
}) => {
	let unmounted = false;
	const subscription = new JetstreamSubscription({
		url: "wss://jetstream2.us-east.bsky.network",
		wantedCollections: [BlueDenizEvent],
		cursor: Number(localStorage.getItem(LOCALSTORAGE_KEYS.jetstreamCursor)) || undefined,
		onConnectionOpen: () => JetstreamLogger.log("Connection opened"),
		onConnectionClose: () => JetstreamLogger.log("Connection closed"),
		onConnectionError: (error) => JetstreamLogger.log("Connection error:", error),
	});

	JetstreamLogger.log("Initialized");

	(async () => {
		for await (const event of subscription) {
			if (unmounted) break;
			if (event.kind == "commit" && event.commit.collection === BlueDenizEvent) {
				JetstreamLogger.log("Commit:", event);
				const source = UtilEventSource.at(event.did, event.commit.collection, event.commit.rkey);
				JetstreamLogger.log(event.commit.operation + ":", source);

				// if (event.commit.operation != "delete" && await DataDB.has(source)) {
				// 	try {
				// 		const data = EventDataSchema.parse(event.commit.record);
				// 		await DataDB.put(source, { data });
				// 	} catch (e) {
				// 		console.error(e);
				// 		await DataDB.delete(source);
				// 	}
				// }
			}
		}
	})();

	const interval = setInterval(() => {
		localStorage.setItem(LOCALSTORAGE_KEYS.jetstreamCursor, String(subscription.cursor));
	}, 5_000);

	return () => {
		unmounted = true;
		clearInterval(interval);
	};
};

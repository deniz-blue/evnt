import { createJetstream } from "./lib/atproto/jetstream";
import { DataDB } from "./db/data-db";
import { EventResolver } from "./db/event-resolver";
import { eventQueryKey } from "./db/useEventQuery";
import { useLayersStore } from "./db/useLayersStore";
import { useATProtoAuthStore } from "./lib/atproto/useATProtoStore";
import { useCacheEventsStore } from "./lib/cache/useCacheEventsStore";
import { queryClient } from "./query-client";
import { useHomeStore } from "./stores/useHomeStore";

window.addEventListener("storage", (event) => {
	if (event.key === useLayersStore.persist.getOptions().name) useLayersStore.persist.rehydrate();
	if (event.key === useHomeStore.persist.getOptions().name) useHomeStore.persist.rehydrate();
});

useATProtoAuthStore.getState().initialize();
(async () => {
	console.time("Cache initialization");
	await useCacheEventsStore.getState().init();
	console.timeEnd("Cache initialization");
})();

DataDB.onUpdate((source) => {
	queryClient.invalidateQueries({ queryKey: eventQueryKey(source) });
});

DataDB.onUpdate((source) => {
	useCacheEventsStore.getState().hydrateSource(source);
});

createJetstream({
	onCommit: async (source, record, event) => {
		if (event.commit.operation == "delete") return; // TODO
		if (!(await DataDB.has(source))) return; // if not in db skip (otherwise we might download every event on atproto lol)
		const envelope = EventResolver.fromJsonObject(record);
		await DataDB.put(source, envelope);
	},
});

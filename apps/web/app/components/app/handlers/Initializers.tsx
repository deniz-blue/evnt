import { useQueryClient } from "@tanstack/react-query";
import { useHomeStore } from "../../../stores/useHomeStore";
import { useLayersStore } from "../../../db/useLayersStore";
import { useEffect } from "react";
import { useWindowEvent } from "@mantine/hooks";
import { DataDB } from "../../../db/data-db";
import { eventQueryKey } from "../../../db/useEventQuery";
import { useATProtoAuthStore } from "../../../lib/atproto/useATProtoStore";
import { createJetstream } from "./jetstream";
import { EventResolver } from "../../../db/event-resolver";
import { useCacheEventsStore } from "../../../lib/cache/useCacheEventsStore";

export const Initializers = () => {
	const queryClient = useQueryClient();

	useEffect(() => {
		useATProtoAuthStore.getState().initialize();
		(async () => {
			console.time("Cache initialization");
			await useCacheEventsStore.getState().init();
			console.timeEnd("Cache initialization");
		})();
	}, []);

	useEffect(() => {
		return DataDB.onUpdate((source) => {
			queryClient.invalidateQueries({ queryKey: eventQueryKey(source) });
			useCacheEventsStore.getState().hydrateSource(source);
		});
	}, [queryClient]);

	useEffect(() => {
		return createJetstream({
			onCommit: async (source, record, event) => {
				if (event.commit.operation == "delete") return; // TODO
				if (!(await DataDB.has(source))) return; // if not in db skip (otherwise we might download every event on atproto lol)
				const envelope = EventResolver.fromJsonObject(record);
				await DataDB.put(source, envelope);
			},
		});
	}, []);

	useWindowEvent("storage", (event) => {
		if (event.key === useLayersStore.persist.getOptions().name) useLayersStore.persist.rehydrate();
		if (event.key === useHomeStore.persist.getOptions().name) useHomeStore.persist.rehydrate();
	});

	return null;
};

import { useQueryClient } from "@tanstack/react-query";
import { useHomeStore } from "../../../stores/useHomeStore";
import { useLayersStore } from "../../../db/useLayersStore";
import { useEffect } from "react";
import { useWindowEvent } from "@mantine/hooks";
import { DataDB } from "../../../db/data-db";
import { eventDataQueryKey } from "../../../db/useEventDataQuery";

export const Initializers = () => {
	const queryClient = useQueryClient();

	useEffect(() => {
		return DataDB.onUpdate((key) => {
			queryClient.invalidateQueries({ queryKey: [eventDataQueryKey(key), "event-data-keys"] });
		});
	}, [queryClient]);

	useWindowEvent("storage", (event) => {
		if (event.key === useLayersStore.persist.getOptions().name) useLayersStore.persist.rehydrate();
		if (event.key === useHomeStore.persist.getOptions().name) useHomeStore.persist.rehydrate();
	});

	return null;
};

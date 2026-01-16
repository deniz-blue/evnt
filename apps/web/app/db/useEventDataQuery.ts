import { queryOptions, useQuery } from "@tanstack/react-query";
import { UtilEventSource, type EventDataSource } from "./models/event-source";
import { DataDB } from "./data-db";
import { EventDataSchema, type EventData } from "@evnt/schema";
import { fetchValidate } from "../lib/util/fetchValidate";

export const eventDataQueryKey = (key: string) => {
	return ["event-data", key] as const;
};

export const eventDataQueryOptions = (source: EventDataSource) => {
	return queryOptions({
		queryKey: eventDataQueryKey(UtilEventSource.getKey(source)),
		networkMode: "always",
		refetchOnReconnect: UtilEventSource.isRemote(source),
		queryFn: async (): Promise<EventData> => {
			const cached = await DataDB.get(UtilEventSource.getKey(source));

			if (cached == null) {
				switch (source.type) {
					case "local":
						throw new Error("Event data not found");
					case "remote":
						const result = await fetchValidate(source.url, EventDataSchema);
						if (!result.ok) throw new Error(`Failed to fetch event data: ${result.error}`);
						return result.value;
				};
			};

			return cached.data;
		},
	});
};

export const useEventDataQuery = (source: EventDataSource) => {
	const query = useQuery(eventDataQueryOptions(source));
	return query;
};

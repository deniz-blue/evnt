import { queryOptions, useQueries, useQuery } from "@tanstack/react-query";
import { UtilEventSource, type EventDataSource } from "./models/event-source";
import { type EventData } from "@evnt/schema";
import { useMemo } from "react";
import { EventDataResolver } from "../lib/resolve/resolve";

export const eventDataQueryKey = (key: string) => {
	return ["event-data", key] as const;
};

export const eventDataQueryOptions = (source: EventDataSource) => {
	return queryOptions({
		queryKey: eventDataQueryKey(UtilEventSource.getKey(source)),
		networkMode: "always",
		refetchOnReconnect: UtilEventSource.isRemote(source),
		queryFn: async (): Promise<EventData> => {
			return await EventDataResolver.getDataWithCache(source);
		},
	});
};

export const useEventDataQuery = (source: EventDataSource) => {
	const query = useQuery(eventDataQueryOptions(source));
	return query;
};

export type EventDataQueryResult = {
	query: ReturnType<typeof useQuery<EventData>>;
	source: EventDataSource;
};

export const useEventQueries = (sources: EventDataSource[]): EventDataQueryResult[] => {
	const queries = useQueries({
		queries: sources.map((source) => (
			eventDataQueryOptions(source)
		)),
	});

	const result = useMemo(() => {
		return queries.map((query, index) => ({ query, source: sources[index]! }));
	}, [queries, sources]);

	return result;
}

import { queryOptions, useQueries, useQuery } from "@tanstack/react-query";
import { UtilEventSource, type EventSource } from "./models/event-source";
import { useMemo } from "react";
import { EventResolver } from "./resolve/resolve";
import type { EventEnvelope } from "./models/event-envelope";

export const eventDataQueryKey = (source: EventSource) => {
	return ["event-data", source] as const;
};

export const eventDataQueryOptions = (source: EventSource) => {
	return queryOptions({
		queryKey: eventDataQueryKey(source),
		networkMode: "always",
		refetchOnReconnect: UtilEventSource.isFromNetwork(source),
		queryFn: async (): Promise<EventEnvelope> => {
			return await EventResolver.resolve(source);
		},
	});
};

export const useEventDataQuery = (source: EventSource) => {
	const query = useQuery(eventDataQueryOptions(source));
	return query;
};

export type EventDataQueryResult = {
	query: ReturnType<typeof useQuery<EventEnvelope>>;
	source: EventSource;
};

export const useEventQueries = (sources: EventSource[]): EventDataQueryResult[] => {
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

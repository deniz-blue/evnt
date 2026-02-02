import { queryOptions, useQueries, useQuery } from "@tanstack/react-query";
import { UtilEventSource, type EventSource } from "./models/event-source";
import { useMemo } from "react";
import { EventResolver } from "./resolve/resolve";
import type { EventEnvelope } from "./models/event-envelope";

export const eventQueryKey = (source: EventSource) => {
	return ["event-data", source] as const;
};

export const eventQueryOptions = (source: EventSource) => {
	return queryOptions({
		queryKey: eventQueryKey(source),
		networkMode: "always",
		refetchOnReconnect: UtilEventSource.isFromNetwork(source),
		queryFn: async (): Promise<EventEnvelope> => {
			return await EventResolver.resolve(source);
		},
	});
};

export const useEventQuery = (source: EventSource) => {
	const query = useQuery(eventQueryOptions(source));
	return query;
};

export type EventQueryResult = {
	query: ReturnType<typeof useQuery<EventEnvelope>>;
	source: EventSource;
};

export const useEventQueries = (sources: EventSource[]): EventQueryResult[] => {
	const queries = useQueries({
		queries: sources.map((source) => (
			eventQueryOptions(source)
		)),
	});

	const result = useMemo(() => {
		return queries.map((query, index) => ({ query, source: sources[index]! }));
	}, [queries, sources]);

	return result;
}

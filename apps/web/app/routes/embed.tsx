import { useSearchParams } from "react-router";
import { UtilEventSource } from "../db/models/event-source";
import { Stack, Text } from "@mantine/core";
import { useEventQueries } from "../db/useEventQuery";
import { EventCard } from "../components/content/event/EventCard";
import { useQuery } from "@tanstack/react-query";
import { EventResolver } from "../db/resolve/resolve";

export default function EmbedPage() {
	const [searchParams] = useSearchParams();
	const sourceParam = searchParams.get("source");
	const eventDataParam = searchParams.get("event-data");
	const source = sourceParam && UtilEventSource.is(sourceParam, false) ? sourceParam : null;
	const [sourceResult] = useEventQueries((source && !eventDataParam) ? [source] : []);
	const eventDataParamQuery = useQuery({
		queryKey: ["embed-event-data", eventDataParam],
		enabled: !!eventDataParam,
		queryFn: async () => {
			if (!eventDataParam) throw new Error("No event data parameter provided");
			return await EventResolver.fromJsonText(eventDataParam);
		},
	});

	if (!source && !eventDataParam) return (
		<Stack align="center" justify="center" style={{ height: "100%" }}>
			<Text>Invalid source or event data parameter!</Text>
		</Stack>
	);

	const query = eventDataParam ? eventDataParamQuery : sourceResult?.query;

	return (
		<Stack align="center" justify="center" style={{ height: "100%" }}>
			<EventCard
				data={query?.data?.data ?? null}
				err={query?.data?.err}
				rev={query?.data?.rev}
				loading={query?.isLoading ?? false}
				source={source ?? undefined}
				embed
			/>
			<style children="html, body { height: 100%; margin: 0; }" />
		</Stack>
	)
}

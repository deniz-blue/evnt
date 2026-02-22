import { createFileRoute } from "@tanstack/react-router"
import z from "zod";
import { RemoteEventSourceSchema, UtilEventSource } from "../db/models/event-source";
import { zodValidator } from "@tanstack/zod-adapter";
import { useEventQueries } from "../db/useEventQuery";
import { EventResolver } from "../db/event-resolver";
import { Stack, Text } from "@mantine/core";
import { EventCard } from "../components/content/event/card/EventCard";
import { useQuery } from "@tanstack/react-query";

const SearchParamsSchema = z.object({
	source: RemoteEventSourceSchema.optional(),
	"event-data": z.string().optional(),
});

export const Route = createFileRoute("/embed")({
	component: EmbedPage,
	validateSearch: zodValidator(SearchParamsSchema),
})

function EmbedPage() {
	const search = Route.useSearch();

	const source = search.source && UtilEventSource.is(search.source, false) ? search.source : null;
	const [sourceResult] = useEventQueries((source && !search["event-data"]) ? [source] : []);
	const eventDataParamQuery = useQuery({
		queryKey: ["embed-event-data", search["event-data"]],
		enabled: !!search["event-data"],
		queryFn: async () => {
			if (!search["event-data"]) throw new Error("No event data parameter provided");
			return await EventResolver.fromJsonText(search["event-data"]);
		},
	});

	if (!source && !search["event-data"]) return (
		<Stack align="center" justify="center" style={{ height: "100%" }}>
			<Text>Invalid source or event data parameter!</Text>
		</Stack>
	)

	const query = search["event-data"] ? eventDataParamQuery : sourceResult?.query;

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

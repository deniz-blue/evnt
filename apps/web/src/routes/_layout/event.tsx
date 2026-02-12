import { createFileRoute } from "@tanstack/react-router"
import z from "zod";
import { EventSourceSchema } from "../../db/models/event-source";
import { useEventQuery } from "../../db/useEventQuery";
import { Stack } from "@mantine/core";
import { EventDetailsContent } from "../../components/content/event/details/EventDetailsContent";
import type { EventEnvelope } from "../../db/models/event-envelope";

const SearchParamsSchema = z.object({
	source: EventSourceSchema,
});

export const Route = createFileRoute("/_layout/event")({
	component: EventPage,
	validateSearch: SearchParamsSchema,
})

function EventPage() {
	const { source } = Route.useSearch();
	const query = useEventQuery(source);

	return (
		<Stack>
			<EventDetailsContent
				source={source}
				{...query?.data ?? {
					data: null,
				} as EventEnvelope}
			/>
		</Stack>
	)
}

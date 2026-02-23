import { createFileRoute } from "@tanstack/react-router"
import z from "zod";
import { EventSourceSchema } from "../../db/models/event-source";
import { useEventQuery } from "../../db/useEventQuery";
import { Container, Stack } from "@mantine/core";
import { EventDetailsContent } from "../../components/content/event/details/EventDetailsContent";
import type { EventEnvelope } from "../../db/models/event-envelope";

const SearchParamsSchema = z.object({
	source: EventSourceSchema,
});

export const Route = createFileRoute("/_layout/event")({
	component: EventPage,
	validateSearch: SearchParamsSchema,
	staticData: {
		spaceless: true,
	},
})

function EventPage() {
	const { source } = Route.useSearch();
	const query = useEventQuery(source);

	return (
		<Stack
			w="100%"
			align="center"
		>
			<Container
				size="md"
				p={0}
				w="100%"
				mih="100dvh"
				style={{
					boxShadow: "0 0 50px rgba(0,0,0,0.2)",
				}}
			>
				<Stack>
					<EventDetailsContent
						source={source}
						{...query?.data ?? {
							data: null,
						} as EventEnvelope}
					/>
				</Stack>
			</Container>
		</Stack>
	)
}

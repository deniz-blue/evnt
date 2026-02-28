import { createFileRoute } from "@tanstack/react-router";
import { useEventQueries } from "../../db/useEventQuery";
import { Box, Container, Group, ScrollArea, Stack, Text, Title } from "@mantine/core";
import { useCacheEventsStore } from "../../lib/cache/useCacheEventsStore";
import { useShallow } from "zustand/shallow";
import { UtilPartialDate } from "@evnt/schema/utils";
import { EventEnvelopeProvider } from "../../components/content/event/event-envelope-context";
import { EventCard } from "../../components/content/event/card/EventCard";
import { EventContextMenu } from "../../components/content/event/EventContextMenu";

export const Route = createFileRoute("/_layout/")({
	component: HomePage,
})

export default function HomePage() {
	const today = UtilPartialDate.today();
	const firstFiveUpcomingEvents = useCacheEventsStore(
		useShallow(state => {
			return Array.from(new Set(
				Object.entries(state.cache.byDay)
					.filter(([day]) => day >= today)
					.sort(([a], [b]) => a.localeCompare(b))
					.flatMap(([_, sources]) => sources)
			)).slice(0, 5);
		})
	);
	const queries = useEventQueries(firstFiveUpcomingEvents);

	return (
		<Container size="md">
			<Stack>
				<Title>
					Home
				</Title>
				<Text c="dimmed">
					Homepage work in progress
				</Text>
			</Stack>
			<Stack>
				<Title order={2}>
					Upcoming Events
				</Title>
				<ScrollArea.Autosize maw="100%" scrollbars="x" offsetScrollbars p={4}>
					<Group
						wrap="nowrap"
						mih={400}
						align="stretch"
					>
						{queries.map(({ query, source }, index) => (
							<Box
								key={index}
								miw={500}
								bg="dark"
							>
								<EventEnvelopeProvider
									value={query.data ?? { data: null }}
								>
									<EventCard
										variant="card"
										source={source}
										loading={query.isFetching}
										menu={<EventContextMenu source={source} />}
									/>
								</EventEnvelopeProvider>
							</Box>
						))}
					</Group>
				</ScrollArea.Autosize>
			</Stack>
		</Container>
	)
}

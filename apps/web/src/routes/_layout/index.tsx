import { createFileRoute } from "@tanstack/react-router";
import { EventsGrid } from "../../components/content/event-grid/EventsGrid";
import { useEventQueries } from "../../db/useEventQuery";
import { useHomeStore } from "../../stores/useHomeStore";
import { Container, Group, ScrollArea, Stack, Text, Title } from "@mantine/core";

export const Route = createFileRoute("/_layout/")({
	component: HomePage,
})

export default function HomePage() {
	const pinnedEventSources = useHomeStore((state) => state.pinnedEvents);
	const pinnedEvents = useEventQueries(pinnedEventSources);

	return (
		<Container size="md">
			<Stack>
				<Title>
					Home
				</Title>
				<Text c="dimmed">
					Welcome to @evnt Viewer! Pinned events will show up here for quick access.
				</Text>
			</Stack>
			<Stack>
				<ScrollArea.Autosize maw="100%" scrollbars="x" offsetScrollbars p={4}>
					<Group wrap="nowrap">
						<EventsGrid queries={pinnedEvents} />
					</Group>
				</ScrollArea.Autosize>
			</Stack>
		</Container>
	)
}

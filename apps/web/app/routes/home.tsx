import { EventCard } from "../components/content/event/EventCard";
import { EventContextMenu } from "../components/content/event/EventContextMenu";
import { RQResult } from "../components/data/RQResult";
import { useEventQueries } from "../db/useEventDataQuery";
import { useHomeStore } from "../stores/useHomeStore";
import { Container, Group, ScrollArea, Stack, Text, Title } from "@mantine/core";

export default function Home() {
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
						{pinnedEvents.map(({ query, source }, index) => (
							<RQResult key={index} query={query}>
								{(data) => (
									<EventCard
										value={data}
										source={source}
										menu={<EventContextMenu source={source} />}
									/>
								)}
							</RQResult>
						))}
					</Group>
				</ScrollArea.Autosize>
			</Stack>
		</Container>
	);
}

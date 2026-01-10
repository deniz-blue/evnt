import { InstanceInfoSection } from "../components/app/instance/InstanceInfoSection";
import { EventCard } from "../components/content/event/EventCard";
import { EventContextMenu } from "../components/content/event/EventContextMenu";
import { useEventStore } from "../stores/useEventStore";
import { useHomeStore } from "../stores/useHomeStore";
import type { Route } from "./+types/home";
import { Box, Button, Container, Group, ScrollArea, Stack, Title } from "@mantine/core";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "Universal Events Format" },
	];
}

export default function Home() {
	const pinnedEventIds = useHomeStore((state) => state.pinnedEventIds);
	const events = useEventStore((state) => state.data);

	const pinnedEvents = events.filter(event => pinnedEventIds.includes(event.id!));

	return (
		<Container size="md">
			<Stack>
				<Title>
					Home
				</Title>
			</Stack>
			<Stack>
				<ScrollArea.Autosize maw="100%" scrollbars="x" offsetScrollbars p={4}>
					<Group wrap="nowrap">
						{pinnedEvents.map(event => (
							<Box w="20rem" h="20rem" key={event.id}>
								<EventCard value={event.data} id={event.id} menu={<EventContextMenu event={event} />} />
							</Box>
						))}
					</Group>
				</ScrollArea.Autosize>
			</Stack>
		</Container>
	);
}

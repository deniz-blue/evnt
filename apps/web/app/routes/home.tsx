import { InstanceInfoSection } from "../components/app/instance/InstanceInfoSection";
import { EventCard } from "../components/content/event/EventCard";
import { useEventStore } from "../lib/stores/useEventStore";
import { useHomeStore } from "../lib/stores/useHomeStore";
import type { Route } from "./+types/home";
import { Button, Container, Stack, Title } from "@mantine/core";

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
				{pinnedEvents.map(event => (
					<EventCard key={event.id} value={event.data} id={event.id} />
				))}
			</Stack>
		</Container>
	);
}

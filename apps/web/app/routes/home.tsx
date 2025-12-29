import { EventCard } from "../components/event/EventCard";
import { useEventStore } from "../lib/database/useEventStore";
import type { Route } from "./+types/home";
import { Button, Container, Stack, Title } from "@mantine/core";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "Universal Events Format" },
	];
}

export default function Home() {
	const events = useEventStore((state) => state.events);

	return (
		<Container size="md">
			<Stack>
				<Title>
					Home
				</Title>

				{events.map((event, index) => (
					<EventCard key={index} value={event.data} variant="horizontal" />
				))}

				<Button
					onClick={() => {
						useEventStore.getState().createLocalEvent({
							instances: [],
							name: { en: "Random Event " + Math.floor(Math.random() * 1000) },
							description: { en: "This is a randomly generated event." },
							venues: [],
							v: 0,
						});
					}}
				>
					Add Random Data
				</Button>
			</Stack>
		</Container>
	);
}

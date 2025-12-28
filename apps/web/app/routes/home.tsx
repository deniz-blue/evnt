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
		<Container size="md" py="xl">
			<Title>
				Home
			</Title>

			<Stack>
				{events.map((event, index) => (
					<div key={index}>
						<p>Event {index + 1}:</p>
						<pre>{JSON.stringify(event, null, 2)}</pre>
					</div>
				))}
			</Stack>

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
		</Container>
	);
}

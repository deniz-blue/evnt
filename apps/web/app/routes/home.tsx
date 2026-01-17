import { InstanceInfoSection } from "../components/app/instance/InstanceInfoSection";
import { EventCard } from "../components/content/event/EventCard";
import { EventContextMenu } from "../components/content/event/EventContextMenu";
import { RQResult } from "../components/data/RQResult";
import { useEventQueries } from "../db/useEventDataQuery";
import { useHomeStore } from "../stores/useHomeStore";
import type { Route } from "./+types/home";
import { Box, Button, Container, Group, ScrollArea, Stack, Title } from "@mantine/core";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "Universal Events Format" },
	];
}

export default function Home() {
	const pinnedEventSources = useHomeStore((state) => state.pinnedEvents);
	const pinnedEvents = useEventQueries(pinnedEventSources);

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

import { ActionIcon, SimpleGrid, Stack, Text } from "@mantine/core";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { EventCard } from "../components/content/event/EventCard";
import { EventDataSchema, type EventData } from "@evnt/schema";
import { IconDotsVertical } from "@tabler/icons-react";
import type { EventEnvelope } from "../db/models/event-envelope";
import { Fragment } from "react/jsx-runtime";

export default function Test() {
	const [toggled, { toggle }] = useDisclosure();

	useHotkeys([["Space", () => toggle()]]);

	const testData1: EventData = {
		v: 0,
		name: { en: "Test Event 1" },
		label: { en: "This is a test event used for demonstration purposes." },
	};

	const dummyMenu = (
		<ActionIcon
			variant="subtle"
			color="gray"
			size="sm"
		>
			<IconDotsVertical />
		</ActionIcon>
	);

	const issues = EventDataSchema.safeParse({
		v: "invalid-version",
		name: 123,
	}).error!.issues;

	return (
		<Stack align="center">
			<Text>
				{toggled ? "Toggled On" : "Toggled Off"}
			</Text>

			<SimpleGrid cols={2}>
				<EventCard
					data={null}
					loading={toggled}
					menu={dummyMenu}
				/>
				<EventCard
					data={testData1}
					loading={toggled}
					menu={dummyMenu}
				/>
				<EventCard
					data={testData1}
					loading={toggled}
					menu={dummyMenu}
					source="local://test"
				/>
				{([
					{ kind: "fetch", message: "Failed to fetch event data." },
					{ kind: "fetch", message: "Failed to fetch event data.", status: 500 },
					{ kind: "fetch", message: "Failed to fetch event data.", status: 400 },
					{ kind: "json-parse", message: "Failed to parse event data." },
					{ kind: "validation", issues },
					{ kind: "xrpc", message: "XRPC error occurred.", error: "InvalidRequest", status: 403 },
				] as EventEnvelope.Error[]).map((err, index) => (
					<Fragment key={index}>
						<EventCard
							key={index}
							data={null}
							loading={toggled}
							menu={dummyMenu}
							err={err}
						/>
						<EventCard
							key={index}
							data={testData1}
							loading={toggled}
							menu={dummyMenu}
							err={err}
						/>
					</Fragment>
				))}
			</SimpleGrid>
		</Stack>
	)
}
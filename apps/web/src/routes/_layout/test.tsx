import { createFileRoute } from "@tanstack/react-router"
import { ActionIcon, Box, Code, SimpleGrid, Stack, Table, Text } from "@mantine/core";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { EventCard } from "../../components/content/event/card/EventCard";
import { EventDataSchema, type EventData, type PartialDate, type Translations } from "@evnt/schema";
import { IconDotsVertical } from "@tabler/icons-react";
import type { EventEnvelope } from "../../db/models/event-envelope";
import { Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { TranslationsInput } from "../../components/base/input/TranslationsInput";
import { snippetInstance, type Range } from "@evnt/pretty";
import { Snippet } from "../../components/content/Snippet";

export const Route = createFileRoute("/_layout/test")({
	component: Test,
})

export default function Test() {
	const [toggled, { toggle }] = useDisclosure();
	const [translations, setTranslations] = useState<Translations>({
		en: "Hello",
		tr: "Merhaba",
		lt: "Labas",
	});

	useHotkeys([["Space", () => toggle()]]);

	const testData1: EventData = {
		v: 0,
		name: { en: "Test Event 1" },
		label: { en: "This is a test event used for demonstration purposes." },
	}

	const dummyMenu = (
		<ActionIcon
			variant="subtle"
			color="gray"
			size="sm"
		>
			<IconDotsVertical />
		</ActionIcon>
	)

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
				<TranslationsInput
					value={translations}
					onChange={setTranslations}
					label="Translations Input"
				/>
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
							data={null}
							loading={toggled}
							menu={dummyMenu}
							err={err}
						/>
						<EventCard
							data={testData1}
							loading={toggled}
							menu={dummyMenu}
							err={err}
						/>
					</Fragment>
				))}
			</SimpleGrid>

			<Table
				data={{
					body: ([
						{ start: "2025-12-25", end: undefined },
						{ start: "2025-12-25", end: "2025-12-31" },
						{ start: "2025-12-25T11:00", end: "2025-12-31" },
						{ start: "2025-12-25T11:00", end: "2025-12-25" },
						{ start: "2025-12-25T11:00", end: "2025-12-31T15:00" },
						{ start: "2025-12-25T11:00", end: "2025-12-25T15:00" },
					] as Range<PartialDate>[]).map((range) => ([
						<Box>
							<Code>{range.start} | {range.end}</Code>
						</Box>,
						<Stack gap={4}>
							{snippetInstance({
								venueIds: [],
								...range,
							}).map((snippet, index) => (
								<Snippet key={index} snippet={snippet} />
							))}
						</Stack>,
					])),
				}}
			/>
		</Stack>
	)
}
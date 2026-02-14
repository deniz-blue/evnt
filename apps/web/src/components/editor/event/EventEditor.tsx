import { EventDataSchema, type EventData } from "@evnt/schema";
import type { EditAtom } from "../edit-atom";
import { Button, Container, Group, JsonInput, Stack, Tabs, Text, Textarea } from "@mantine/core";
import { EditEvent } from "./EditEvent";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { EventCard } from "../../content/event/EventCard";
import { useEffect, useMemo, useState } from "react";
import { z, type ZodError } from "zod";
import { tryCatch } from "../../../lib/util/trynull";

export const EventEditor = ({ data }: { data: EditAtom<EventData> }) => {
	const errorsAtom = useMemo(() => atom<ZodError | string | null>(null), []);
	const isValid = useAtomValue(useMemo(() => atom((get) => (
		get(errorsAtom) === null
	)), [data]));

	return (
		<Stack gap={0}>
			<Tabs defaultValue="form">
				<Tabs.List>
					<Tabs.Tab value="form" disabled={!isValid}>Form Editor</Tabs.Tab>
					<Tabs.Tab value="json">JSON Editor</Tabs.Tab>
					<Tabs.Tab value="preview" disabled={!isValid}>Preview</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panel value="form" pt="xs">
					<EditEvent data={data} />
				</Tabs.Panel>

				<Tabs.Panel value="json" pt="xs">
					<ValidatedAtomJsonInput
						data={data}
						errorsAtom={errorsAtom}
					/>
				</Tabs.Panel>

				<Tabs.Panel value="preview" pt="xs">
					<EventPreview data={data} />
				</Tabs.Panel>
			</Tabs>
		</Stack>
	);
};

export const ValidatedAtomJsonInput = ({
	data,
	errorsAtom,
}: {
	data: EditAtom<EventData>;
	errorsAtom: EditAtom<ZodError | string | null>;
}) => {
	const eventData = useAtomValue(data);
	const [value, setValue] = useState(() => JSON.stringify(eventData, null, 2));
	const errors = useAtomValue(errorsAtom);

	const revert = useSetAtom(useMemo(() => atom(null, (get, set) => {
		set(errorsAtom, null);
		setValue(JSON.stringify(get(data), null, 2));
	}), [data, errorsAtom]));

	// Whenever the data changes externally (e.g. through the form editor), update the JSON input value
	useEffect(() => {
		setValue(JSON.stringify(eventData, null, 2));
	}, [eventData]);

	const onChange = useSetAtom(useMemo(() => atom(null, (get, set, newValue: string) => {
		setValue(newValue);

		const [obj, error] = tryCatch(() => JSON.parse(newValue));
		if (error) return set(errorsAtom, "Invalid JSON: " + error.message);

		const result = EventDataSchema.safeParse(obj);
		if (!result.success) return set(errorsAtom, result.error);

		set(data, result.data);
		set(errorsAtom, null);
	}), []));

	return (
		<Stack gap={4}>
			<Textarea
				label="Event Data (JSON)"
				description="Be careful its janky (won't mess your data though)"
				autosize
				value={value}
				onChange={e => onChange(e.currentTarget.value)}
				error={typeof errors === "string" ? errors : errors ? (
					<Text inline inherit span>
						{z.prettifyError(errors)}
					</Text>
				) : null}
				rightSectionWidth="auto"
				rightSectionPointerEvents="none"
				rightSection={errors && (
					<Stack align="start" h="100%" p="sm">
						<Button
							style={{ pointerEvents: "auto" }}
							onClick={revert}
							color="yellow"
							size="compact-sm"
						>
							Revert
						</Button>
					</Stack>
				)}
				spellCheck={false}
				autoComplete="off"
				data-monospace
			/>
		</Stack>
	);
};

export const EventPreview = ({ data }: { data: EditAtom<EventData> }) => {
	const snap = useAtomValue(data);

	return (
		<Stack>
			<EventCard
				variant="card"
				data={snap}
			/>
		</Stack>
	);
}

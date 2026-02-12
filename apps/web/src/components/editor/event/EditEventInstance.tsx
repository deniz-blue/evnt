import type { EventData, EventInstance, PartialDate, Venue } from "@evnt/schema";
import { Box, Button, CloseButton, Combobox, Group, Input, Paper, SimpleGrid, Stack, Text, useCombobox } from "@mantine/core";
import { DeatomOptional, type EditAtom } from "../edit-atom";
import { PartialDateInput } from "../../base/input/PartialDateInput";
import { focusAtom } from "jotai-optics";
import { IconCalendar, type ReactNode } from "@tabler/icons-react";
import { useMemo } from "react";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { Snippet } from "../../content/Snippet";
import { snippetInstance, snippetVenue } from "@evnt/pretty";
import { VenueAtomDisplay } from "./EditVenue";
import { UtilPartialDate } from "@evnt/schema/utils";
import { CollapsiblePaper } from "./CollapsiblePaper";

export const EditEventInstance = ({
	data,
	instance,
	onDelete,
}: {
	data: EditAtom<EventData>;
	instance: EditAtom<EventInstance>;
	onDelete: () => void;
}) => {
	return (
		<CollapsiblePaper
			onDelete={onDelete}
			title={(
				<InstanceAtomDisplay instance={instance} />
			)}
		>
			<EditEventInstanceVenues
				data={data}
				instance={instance}
			/>

			<SimpleGrid type="container" cols={{ base: 1, "450px": 2 }}>
				{(["start", "end"] as const).map((field) => (
					<Stack gap={4} key={field}>
						<Stack gap={0}>
							<Input.Label>{field == "start" ? "Start Date & Time" : "End Date & Time"}</Input.Label>
							<Input.Description>
								{field == "start" ? "When the event instance starts" : "When the event instance ends"}
							</Input.Description>
						</Stack>
						<DeatomOptional
							component={PartialDateInput}
							atom={focusAtom(instance, o => o.prop(field))}
							set={() => UtilPartialDate.thisMonth()}
						/>
					</Stack>
				))}
			</SimpleGrid>
		</CollapsiblePaper>
	);
};

export const EditEventInstanceVenues = ({
	data,
	instance,
}: {
	data: EditAtom<EventData>;
	instance: EditAtom<EventInstance>;
}) => {
	const venueIdsAtom = useMemo(() => focusAtom(instance, o => o.prop("venueIds")), [instance]);
	const venueIds = useAtomValue(venueIdsAtom);

	const removeVenueId = useSetAtom(useMemo(() => atom(null, (get, set, venueId: string) => {
		set(venueIdsAtom, (prev) => prev?.filter((id) => id !== venueId) ?? []);
	}), [venueIdsAtom]));

	const addVenueId = useSetAtom(useMemo(() => atom(null, (get, set, venueId: string) => {
		const venueIds = get(venueIdsAtom) ?? [];
		if (venueIds.includes(venueId)) return;
		set(venueIdsAtom, [...venueIds, venueId]);
	}), [venueIdsAtom]));

	return (
		<Stack gap={4}>
			<Text fw="bold">Venues ({venueIds.length})</Text>
			<Stack gap={4}>
				{venueIds.map((venueId) => (
					<Group
						key={venueId}
						gap={4}
					>
						<CloseButton
							onClick={() => removeVenueId(venueId)}
						/>
						<Box flex="1">
							<VenueAtomDisplay
								venue={focusAtom(data, o => o.prop("venues").valueOr([]).find((v) => v.venueId === venueId)) as EditAtom<Venue>}
								noSublabel
							/>
						</Box>
					</Group>
				))}
			</Stack>
			<Group>
				<VenueIdPicker
					data={data}
					filter={(venue) => !venueIds.includes(venue.venueId)}
					label="Add"
					onSelect={(venueId) => addVenueId(venueId)}
				/>
			</Group>
		</Stack>
	);
};

export const VenueIdPicker = ({
	data,
	filter = () => true,
	onSelect,
	label,
}: {
	data: EditAtom<EventData>;
	filter?: (venue: Venue, data: EventData) => boolean;
	onSelect?: (venueId: string) => void;
	label?: ReactNode;
}) => {
	const venues = useAtomValue(useMemo(() => atom((get) => {
		const snap = get(data);
		return (snap.venues ?? [])
			.filter((venue) => filter(venue, snap));
	}), [data, filter]));

	const combobox = useCombobox();

	const options = venues.map((venue) => (
		<Combobox.Option
			key={venue.venueId}
			value={venue.venueId}
		>
			<Snippet snippet={snippetVenue(venue)} />
		</Combobox.Option>
	));

	if (!venues.length) return null;

	return (
		<Combobox
			store={combobox}
			onOptionSubmit={onSelect}
			width="max-content"
		>
			<Combobox.Target>
				<Button
					onClick={() => combobox.toggleDropdown()}
				>
					{label}
				</Button>
			</Combobox.Target>
			<Combobox.Dropdown>
				{options}
			</Combobox.Dropdown>
		</Combobox>
	);
};

export const InstanceAtomDisplay = ({ instance }: { instance: EditAtom<EventInstance> }) => {
	const snippets = useAtomValue(useMemo(() => atom((get) => {
		return snippetInstance(get(instance));
	}), [instance]));

	return (
		<Stack gap={4}>
			{snippets.length == 0 && (
				<Snippet
					snippet={{
						icon: "calendar",
						label: { type: "text", value: "Unknown Date" },
					}}
				/>
			)}
			{snippets.map((snippet, i) => (
				<Snippet key={i} snippet={snippet} />
			))}
		</Stack>
	);
};

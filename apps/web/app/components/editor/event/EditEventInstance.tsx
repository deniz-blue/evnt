import type { EventData, EventInstance, PartialDate, Venue } from "@evnt/schema";
import { Box, Button, CloseButton, Combobox, Group, Input, Paper, SimpleGrid, Stack, Text, useCombobox } from "@mantine/core";
import { DeatomOptional, type EditAtom } from "../edit-atom";
import { PartialDateInput } from "../../base/input/PartialDateInput";
import { focusAtom } from "jotai-optics";
import { IconCalendar, type ReactNode } from "@tabler/icons-react";
import { useMemo } from "react";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { Snippet } from "../../content/Snippet";
import { snippetVenue } from "@evnt/pretty";

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
		<Stack>
			<Paper withBorder p="xs">
				<Stack>
					<Group justify="space-between">
						<Group gap={4} align="center" c="dimmed">
							<IconCalendar />
							<Text inherit span fw="bold">Event Instance</Text>
						</Group>
						<CloseButton
							onClick={onDelete}
						/>
					</Group>

					<Stack gap={4}>
						<Text fw="bold">Venues</Text>
						<Stack>
							<EditEventInstanceVenues
								data={data}
								instance={instance}
							/>
						</Stack>
					</Stack>

					<SimpleGrid type="container" cols={{ base: 1, "450px": 2 }}>
						{(["start", "end"] as const).map((field) => (
							<Stack gap={0} key={field}>
								<Input.Label>{field == "start" ? "Start Date & Time" : "End Date & Time"}</Input.Label>
								<DeatomOptional
									component={PartialDateInput}
									atom={focusAtom(instance, o => o.prop(field))}
									set={() => new Date().getFullYear().toString() as PartialDate.Year}
									withDeleteButton={false}
								/>
							</Stack>
						))}
					</SimpleGrid>
				</Stack>
			</Paper>
		</Stack>
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

	const venues = useAtomValue(useMemo(() => atom((get) => {
		const venueIds = get(venueIdsAtom);
		const snap = get(data);
		return (snap.venues ?? []).filter((venue) => venueIds.includes(venue.venueId));
	}), [data, venueIdsAtom]));

	const removeVenueId = useSetAtom(useMemo(() => atom(null, (get, set, venueId: string) => {
		set(venueIdsAtom, (prev) => prev?.filter((id) => id !== venueId) ?? []);
	}), [venueIdsAtom]));

	const addVenueId = useSetAtom(useMemo(() => atom(null, (get, set, venueId: string) => {
		const venueIds = get(venueIdsAtom) ?? [];
		if (venueIds.includes(venueId)) return;
		set(venueIdsAtom, [...venueIds, venueId]);
	}), [venueIdsAtom]));

	return (
		<Stack>
			<Stack gap={4}>
				{venues.map((venue) => (
					<Group
						key={venue.venueId}
					>
						<Box flex="1">
							<Snippet
								snippet={snippetVenue(venue)}
							/>
						</Box>
						<CloseButton
							onClick={() => removeVenueId(venue.venueId)}
						/>
					</Group>
				))}
			</Stack>
			<Group>
				<VenueIdPicker
					data={data}
					filter={(venue) => !venues.map((v) => v.venueId).includes(venue.venueId)}
					label="Add Existing Venue"
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

	return (
		<Combobox
			store={combobox}
			onOptionSubmit={onSelect}
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

import type { EventData, Venue, VenueType } from "@evnt/schema";
import { Deatom, type EditAtom } from "../edit-atom";
import { Button, CloseButton, Group, Input, Paper, SegmentedControl, Stack, Text, type SegmentedControlProps } from "@mantine/core";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { useMemo, type ReactNode } from "react";
import { IconGlobe, IconMapPin, IconQuestionMark, IconWorld } from "@tabler/icons-react";
import { TranslationsInput } from "../../base/input/TranslationsInput";
import { focusAtom } from "jotai-optics";
import { EditVenuePhysical } from "./EditVenuePhysical";
import { EditVenueOnline } from "./EditVenueOnline";
import { Snippet } from "../../content/Snippet";
import { snippetVenue } from "@evnt/pretty";

export const EditVenue = ({
	venue,
	data,
}: {
	data: EditAtom<EventData>;
	venue: EditAtom<Venue>;
}) => {
	const venueId = useAtomValue(useMemo(() => atom((get) => get(venue).venueId), [venue]));
	const venueType = useAtomValue(useMemo(() => atom((get) => get(venue).venueType), [venue]));

	// atomically change a venue id across all instances and itself
	// return false if the newVenueId already exists
	const changeVenueId = useSetAtom(useMemo(() => atom(null, (get, set, { fromVenueId, toVenueId }: { fromVenueId: string; toVenueId: string }): boolean => {
		if (get(data).venues?.some((v, i) => v.venueId === toVenueId)) {
			return false;
		}

		set(data, prev => {
			return {
				...prev,
				venues: prev.venues?.map((v) => v.venueId === fromVenueId ? { ...v, venueId: toVenueId } : v),
				instances: prev.instances?.map(instance => ({
					...instance,
					venueIds: instance.venueIds?.map(venueId => venueId === fromVenueId ? toVenueId : venueId),
				})) ?? [],
			};
		});

		return true;
	}), [data]));

	// write-only atom to change the venueType
	// helper for if in the future we want logic or required fields
	const setVenueType = useSetAtom(useMemo(() => atom(null, (get, set, newType: VenueType) => {
		set(venue, prev => ({
			...prev,
			venueType: newType,
		}));
	}), [venue]));

	const onDelete = useSetAtom(useMemo(() => atom(null, (get, set) => {
		set(data, prev => ({
			...prev,
			venues: prev.venues?.filter((venue) => venue.venueId !== venueId),
			instances: prev.instances?.map(instance => ({
				...instance,
				venueIds: instance.venueIds?.filter((venueId) => venueId !== venueId),
			})) ?? [],
		}));
	}), [data]));

	return (
		<Stack>
			<Paper withBorder p="xs">
				<Stack>
					<Group justify="space-between">
						<Group gap={4} align="center" c="dimmed">
							<VenueAtomDisplay venue={venue} />
						</Group>
						<Group gap={4}>
							<CloseButton onClick={onDelete} />
						</Group>
					</Group>

					<Deatom
						component={TranslationsInput}
						atom={focusAtom(venue, o => o.prop("venueName"))}
						label="Venue Name"
						description="Place name, URL description, etc."
					/>

					<Group gap={4} grow>
						<Stack gap={0}>
							<Input.Label>Venue Type</Input.Label>
							<Input.Description>
								Type of the venue, which can affect how it's displayed and what additional information is needed.
							</Input.Description>
						</Stack>
						<VenueTypePicker
							value={venueType}
							onChange={setVenueType}
						/>
					</Group>

					<Group gap={4} justify="space-between">
						<Text fw="bold">Venue ID: {venueId}</Text>
						<Button size="xs"
							onClick={() => {
								const newVenueId = prompt("Enter new Venue ID", venueId);
								if (newVenueId && newVenueId !== venueId) {
									const success = changeVenueId({ fromVenueId: venueId, toVenueId: newVenueId });
									if (!success) {
										alert("Venue ID already exists. Please choose a different one.");
									}
								}
							}}	
						>
							Change Venue ID
						</Button>
					</Group>

					{venueType === "physical" && (
						<EditVenuePhysical data={venue as EditAtom<Venue & { venueType: "physical" }>} />
					)}

					{venueType === "online" && (
						<EditVenueOnline data={venue as EditAtom<Venue & { venueType: "online" }>} />
					)}
				</Stack>
			</Paper>
		</Stack>
	);
};

export const VenueTypePicker = ({
	value,
	onChange,
	...props
}: Omit<SegmentedControlProps, "value" | "onChange" | "data"> & {
	value: VenueType;
	onChange: (value: VenueType) => void;
}) => {
	return (
		<SegmentedControl
			data={[
				{ label: <Group gap={4} justify="center"><IconQuestionMark />Unknown</Group>, value: "unknown" },
				{ label: <Group gap={4} justify="center"><IconMapPin />Physical</Group>, value: "physical" },
				{ label: <Group gap={4} justify="center"><IconWorld />Online</Group>, value: "online" },
			]}
			value={value}
			onChange={onChange as any}
			{...props}
		/>
	);
};

export const VenueAtomDisplay = ({
	venue,
}: {
	venue: EditAtom<Venue>;
}) => {
	const snippet = useAtomValue(useMemo(() => atom((get) => {
		return snippetVenue(get(venue));
	}), [venue]));

	return (
		<Snippet snippet={snippet} />
	);
};

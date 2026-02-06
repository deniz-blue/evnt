import type { EventData, Venue, VenueType } from "@evnt/schema";
import { Deatom, type EditAtom } from "../edit-atom";
import { CloseButton, Group, Input, Paper, SegmentedControl, Stack, Text, type SegmentedControlProps } from "@mantine/core";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { useMemo, type ReactNode } from "react";
import { IconMapPin } from "@tabler/icons-react";
import { TranslationsInput } from "../../base/input/TranslationsInput";
import { focusAtom } from "jotai-optics";
import { EditVenuePhysical } from "./EditVenuePhysical";
import { EditVenueOnline } from "./EditVenueOnline";

export const EditVenue = ({
	venue,
	data,
	controls,
}: {
	data: EditAtom<EventData>;
	venue: EditAtom<Venue>;
	controls?: ReactNode;
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
							<IconMapPin />
							<Text inherit span fw="bold">Venue</Text>
						</Group>
						<Group gap={4}>
							<CloseButton onClick={onDelete} />
						</Group>
					</Group>

					<Deatom
						component={TranslationsInput}
						atom={focusAtom(venue, o => o.prop("venueName"))}
						label="Venue Name"
					/>

					<Stack gap={0}>
						<Input.Label>Venue Type</Input.Label>
						<VenueTypePicker
							value={venueType}
							onChange={setVenueType}
						/>
					</Stack>

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
				{ label: "Unknown", value: "unknown" },
				{ label: "Physical", value: "physical" },
				{ label: "Online", value: "online" },
			]}
			value={value}
			onChange={onChange as any}
			{...props}
		/>
	);
};

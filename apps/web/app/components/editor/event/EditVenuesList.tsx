import type { EventData, Venue } from "@evnt/schema";
import type { EditAtom } from "../edit-atom";
import { Button, Group, Stack, Title } from "@mantine/core";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { useMemo, type ReactNode } from "react";
import { EditVenue } from "./EditVenue";
import { focusAtom } from "jotai-optics";

export const EditVenuesList = ({
	data,
	filter,
	title,
	onAddUpdate,
	addLabel = "Add Venue",
	buttons,
}: {
	data: EditAtom<EventData>,
	filter?: (venue: Venue, data: EventData) => boolean;
	onAddUpdate?: (v: EventData, newVenue: Venue) => EventData;
	title?: (amt: number) => ReactNode;
	addLabel?: ReactNode;
	buttons?: ReactNode;
}) => {
	const indexes = useAtomValue(useMemo(() => atom((get) => {
		const snap = get(data)
		return (snap.venues ?? []).map((venue, i) => [venue, i] as const).filter(([venue, i]) => {
			if (filter && !filter(venue, snap)) return false;
			return true;
		}).map(([_, i]) => i);
	}), [data]));

	const addVenue = useSetAtom(useMemo(() => atom(null, (get, set) => {
		let id = get(data).venues?.length ?? 0;
		const existingVenueIds = new Set(get(data).venues?.map(v => v.venueId));
		while (existingVenueIds.has(id.toString())) id++;

		const newVenue: Venue = {
			venueId: id.toString(),
			venueType: "unknown",
			venueName: {},
		};

		set(data, (prev) => {
			let next: EventData = {
				...prev,
				venues: [...(prev.venues ?? []), newVenue],
			};
			if (onAddUpdate) next = onAddUpdate(next, newVenue);
			return next;
		});
	}), [data, onAddUpdate]));


	return (
		<Stack>
			{indexes.length > 0 && (
				<Stack>
					{title ? title(indexes.length) : (
						<Title order={3}>Venues ({indexes.length})</Title>
					)}
					{indexes.map((i) => (
						<EditVenue
							key={i}
							data={data}
							venue={focusAtom(data, o => o.prop("venues").valueOr([]).at(i)) as EditAtom<Venue>}
						/>
					))}
				</Stack>
			)}

			<Group justify="end">
				{buttons}
				<Button
					onClick={addVenue}
				>
					{addLabel}
				</Button>
			</Group>
		</Stack>
	);
};

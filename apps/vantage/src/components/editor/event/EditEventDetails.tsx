import { Group, Input, Stack } from "@mantine/core";
import { TranslationsInput } from "../../base/input/TranslationsInput";
import { EventStatusPicker } from "./EventStatusPicker";
import { type WritableAtom } from "jotai";
import type { EventData } from "@evnt/schema";
import { focusAtom } from "jotai-optics";
import { Deatom } from "../edit-atom";
import { useMemo } from "react";

export const EditEventDetails = ({ data }: { data: WritableAtom<EventData, [EventData], void> }) => {
	const nameAtom = useMemo(() => focusAtom(data, (o) => o.prop("name")), [data]);
	const labelAtom = useMemo(() => focusAtom(data, (o) => o.prop("label").valueOr({})), [data]);
	const statusAtom = useMemo(() => focusAtom(data, (o) => o.prop("status").valueOr("planned")), [data]);

	return (
		<Stack>
			<Deatom
				component={TranslationsInput}
				atom={nameAtom}
				label="Event Name"
				description="Shows up as the main title of the event"
				placeholder="My Cool Event"
				required
			/>

			<Deatom
				component={TranslationsInput}
				atom={labelAtom}
				label="Event Label"
				description="A short, descriptive label. Shows up under the event name."
				placeholder="Friend Group Hangout"
			/>

			<Group grow>
				<Stack gap={0}>
					<Input.Label>Event Status</Input.Label>
					<Input.Description>
						The event's progress and availability
					</Input.Description>
				</Stack>
				<Deatom
					component={EventStatusPicker}
					atom={statusAtom}
				/>
			</Group>
		</Stack>
	);
};


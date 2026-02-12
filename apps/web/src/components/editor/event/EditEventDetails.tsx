import { Group, Input, Stack, Text, Title } from "@mantine/core";
import { TranslationsInput } from "../../base/input/TranslationsInput";
import { EventStatusPicker } from "./EventStatusPicker";
import { type WritableAtom } from "jotai";
import type { EventData } from "@evnt/schema";
import { focusAtom } from "jotai-optics";
import { Deatom } from "../edit-atom";

export const EditEventDetails = ({ data }: { data: WritableAtom<EventData, [EventData], void> }) => {
	return (
		<Stack>
			<Deatom
				component={TranslationsInput}
				atom={focusAtom(data, (o) => o.prop("name"))}
				label="Event Name"
				description="Shows up as the main title of the event"
				placeholder="My Cool Event"
				required
			/>

			<Deatom
				component={TranslationsInput}
				atom={focusAtom(data, (o) => o.prop("description").valueOr({}))}
				label="Event Description"
				description="Currently shows up as long markdown. Might be subjected to change!"
				placeholder="Event Description..."
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
					atom={focusAtom(data, (o) => o.prop("status").valueOr("planned"))}
				/>
			</Group>
		</Stack>
	);
};


import { Group, Stack, Text, Title } from "@mantine/core";
import { TranslationsInput } from "../../base/input/TranslationsInput";
import { EventStatusPicker } from "./EventStatusPicker";
import { type WritableAtom } from "jotai";
import type { EventData } from "@evnt/schema";
import { focusAtom } from "jotai-optics";
import { Deatom } from "../edit-atom";

export const EditEventDetails = ({ data }: { data: WritableAtom<EventData, [EventData], void> }) => {
	return (
		<Stack>
			<Title order={3}>
				Details
			</Title>

			<Deatom
				component={TranslationsInput}
				atom={focusAtom(data, (o) => o.prop("name"))}
				label="Event Name"
				required
			/>

			<Deatom
				component={TranslationsInput}
				atom={focusAtom(data, (o) => o.prop("description").valueOr({}))}
				label="Event Description"
			/>

			<Group grow>
				<Stack gap={0}>
					<Text>Event Status</Text>
				</Stack>
				<Deatom
					component={EventStatusPicker}
					atom={focusAtom(data, (o) => o.prop("status").valueOr("planned"))}
				/>
			</Group>
		</Stack>
	);
};


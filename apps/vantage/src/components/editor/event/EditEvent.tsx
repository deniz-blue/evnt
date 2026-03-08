import { Stack, Text, Title } from "@mantine/core";
import { EditEventDetails } from "./EditEventDetails";
import { EditEventInstanceList } from "./EditEventInstanceList";
import type { EventData } from "../../../../../../packages/schema/src/schemas/EventData";
import type { EditAtom } from "../edit-atom";
import { EditVenuesList } from "./EditVenuesList";
import { EditComponentsList } from "./EditComponentsList";

export const EditEvent = ({ data }: { data: EditAtom<EventData> }) => {
	return (
		<Stack gap="xl">
			<EditEventDetails data={data} />
			<EditEventInstanceList data={data} />
			<EditVenuesList data={data} />
			<EditComponentsList data={data} />
		</Stack>
	);
};

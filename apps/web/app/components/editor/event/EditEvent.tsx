import { Stack } from "@mantine/core";
import { EditEventDetails } from "./EditEventDetails";
import { EditEventInstanceList } from "./EditEventInstanceList";
import type { EventData } from "../../../../../../packages/schema/src/schemas/EventData";
import type { WritableAtom } from "jotai";
import type { EditAtom } from "../edit-atom";

export const EditEvent = ({ atom }: { atom: EditAtom<EventData> }) => {
	return (
		<Stack>
			<EditEventDetails atom={atom} />
			<EditEventInstanceList data={atom} />
		</Stack>
	);
};

import type { Address, OnlineVenue, PhysicalVenue } from "@evnt/schema";
import { DeatomOptional, type EditAtom } from "../edit-atom";
import { Stack } from "@mantine/core";
import { ClearableTextInput } from "../../base/input/ClearableTextInput";
import { focusAtom } from "jotai-optics";

export const EditVenueOnline = ({ data }: { data: EditAtom<OnlineVenue> }) => {
	return (
		<Stack>
			<DeatomOptional
				component={ClearableTextInput}
				atom={focusAtom(data, o => o.prop("url"))}
				set={() => ""}
				setLabel="Add URL"
				withDeleteButton={false}
				label="URL"
			/>
		</Stack>
	)
};

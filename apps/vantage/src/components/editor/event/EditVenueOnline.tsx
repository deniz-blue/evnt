import type { OnlineVenue } from "@evnt/schema";
import { DeatomOptional, type EditAtom } from "../edit-atom";
import { Stack, Text } from "@mantine/core";
import { ClearableTextInput } from "../../base/input/ClearableTextInput";
import { focusAtom } from "jotai-optics";
import { useMemo } from "react";

export const EditVenueOnline = ({ data }: { data: EditAtom<OnlineVenue> }) => {
	const urlAtom = useMemo(() => focusAtom(data, o => o.prop("url")), [data]);

	return (
		<Stack>
			<Text fw="bold">Online Venue Details</Text>

			<DeatomOptional
				component={ClearableTextInput}
				atom={urlAtom}
				set={() => ""}
				setLabel="Add URL"
				label="URL"
			/>
		</Stack>
	)
};

import { Stack, Text, TextInput } from "@mantine/core";
import { Deatom, type EditAtom } from "../../edit-atom";
import type { SourceComponent } from "@evnt/schema";
import { focusAtom } from "jotai-optics";

export const EditComponentSource = ({ data }: { data: EditAtom<SourceComponent> }) => {
	return (
		<Stack>
			<Text c="yellow" fz="xs">
				This component is unstable and not finalized
			</Text>
			<Deatom
				atom={focusAtom(data, o => o.prop("url"))}
				component={TextInput}
				label="Source URL"
				description="Canonical source of information about the event, such as its official website or social media page."
				placeholder="https://example.com"
				withAsterisk
				required
				type="url"
			/>
		</Stack>
	)
};

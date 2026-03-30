import { Stack, Text, Textarea, TextInput } from "@mantine/core";
import { Deatom, type EditAtom } from "../../edit-atom";
import { focusAtom } from "jotai-optics";
import type { Facet } from "@atcute/bluesky-richtext-segmenter";

export type AppBlueSkyRichTextComponent = {
	text: string;
	facets: Facet<any>[];
};

export const EditComponentBlueSkyRichText = ({ data }: { data: EditAtom<AppBlueSkyRichTextComponent> }) => {
	return (
		<Stack>
			<Deatom
				atom={focusAtom(data, o => o.prop("text"))}
				component={Textarea}
				label="Text"
				placeholder="Enter text here..."
				withAsterisk
				minRows={3}
				autosize
				required
			/>
		</Stack>
	)
};

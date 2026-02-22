import { CloseButton, Stack, TextInput } from "@mantine/core";
import { Deatom, type EditAtom } from "../../edit-atom";
import type { MediaSource } from "@evnt/schema";
import { focusAtom } from "jotai-optics";

export const EditMediaSource = ({
	data,
	onDelete,
	urlRef,
}: {
	data: EditAtom<MediaSource>;
	onDelete?: () => void;
	urlRef?: React.Ref<HTMLInputElement>;
}) => {
	return (
		<Stack>
			<Deatom
				atom={focusAtom(data, o => o.prop("url"))}
				component={TextInput}
				placeholder="https://example.com/image.jpg"
				type="url"
				rightSection={onDelete && (
					<CloseButton onClick={onDelete} />
				)}
				ref={urlRef}
			/>
		</Stack>
	)
};

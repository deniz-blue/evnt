import { Button, Input, Stack } from "@mantine/core";
import { DeatomOptional, type EditAtom } from "../../edit-atom";
import type { Media, MediaSource } from "@evnt/schema";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { createRef, useMemo } from "react";
import { EditMediaSource } from "./EditMediaSource";
import { focusAtom } from "jotai-optics";
import { IconPlus } from "@tabler/icons-react";
import { TranslationsInput } from "../../../base/input/TranslationsInput";

export const EditMedia = ({ data }: { data: EditAtom<Media> }) => {
	return (
		<Stack>
			<EditMediaSourceList data={focusAtom(data, o => o.prop("sources"))} />
			<Stack gap={0}>
				<Input.Label>Alternative Text</Input.Label>
				<Input.Description>
					A description of the media for accessibility purposes.
				</Input.Description>
				<DeatomOptional
					component={TranslationsInput}
					atom={focusAtom(data, o => o.prop("alt"))}
					set={{}}
				/>
			</Stack>
		</Stack>
	)
};

export const EditMediaSourceList = ({ data }: { data: EditAtom<MediaSource[]> }) => {
	const refs = useMemo(() => new Map<number, HTMLInputElement>(), []);

	const indexes = useAtomValue(useMemo(() => atom((get) => {
		return (get(data) ?? []).map((_, i) => i);
	}), [data]));

	const addSource = useSetAtom(useMemo(() => atom(null, (get, set) => {
		set(data, prev => [...(prev ?? []), {
			url: "",
		}]);

		setTimeout(() => {
			refs.get((refs.size - 1))?.focus();
		}, 0);
	}), [data]));

	const deleteSource = useSetAtom(useMemo(() => atom(null, (get, set, index: number) => {
		set(data, prev => (prev ?? []).filter((_, i) => i !== index));
	}), [data]));

	return (
		<Stack gap={4}>
			<Stack gap={0}>
				<Input.Label>Media Sources</Input.Label>
				<Input.Description>
					A media can have multiple sources, e.g. for different formats or resolutions. The first source with a valid URL will be used.
				</Input.Description>
			</Stack>
			{indexes.map((i) => (
				<EditMediaSource
					key={i}
					data={focusAtom(data, o => o.at(i)) as EditAtom<MediaSource>}
					onDelete={() => deleteSource(i)}
					urlRef={(ref) => {
						if (ref) refs.set(i, ref);
						return () => void refs.delete(i);
					}}
				/>
			))}
			<Button
				onClick={addSource}
				color="gray"
				leftSection={<IconPlus size={18} />}
				justify="start"
			>
				Add Source
			</Button>
		</Stack >
	)
};

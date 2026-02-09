import { CloseButton, Group, Paper, Stack, Text } from "@mantine/core";
import type { EditAtom } from "../edit-atom";
import type { EventComponent, EventData } from "@evnt/schema";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { useMemo, type ComponentType } from "react";
import { EditComponentLink } from "./EditComponentLink";
import { focusAtom } from "jotai-optics";
import { IconExternalLink, IconLink } from "@tabler/icons-react";
import { EditComponentSource } from "./EditComponentSource";
import { CollapsiblePaper } from "./CollapsiblePaper";

const componentTypeLabels: Record<EventComponent["type"], [ComponentType, string]> = {
	link: [IconLink, "Link Component"],
	source: [IconExternalLink, "Source Component"],
};

export const EditComponent = ({ component, data }: {
	data: EditAtom<EventData>;
	component: EditAtom<EventComponent>;
}) => {
	const type = useAtomValue(useMemo(() => atom((get) => get(component).type), [component]));

	const onDelete = useSetAtom(useMemo(() => atom(null, (get, set) => {
		const index = get(data).components?.findIndex((c) => c === get(component));
		if (index === undefined || index === -1) return;
		set(data, prev => ({
			...prev,
			components: prev.components?.filter((_, i) => i !== index),
		}));
	}), [data, component]));

	const [Icon, label] = componentTypeLabels[type];

	return (
		<CollapsiblePaper
			icon={<Icon />}
			title={label}
			onDelete={onDelete}
		>
			{type === "link" && (
				<EditComponentLink data={focusAtom(component, o => o.prop("data"))} />
			)}

			{type === "source" && (
				<EditComponentSource data={focusAtom(component, o => o.prop("data"))} />
			)}
		</CollapsiblePaper>
	);
};
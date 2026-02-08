import { atom, useAtomValue, useSetAtom } from "jotai";
import { useMemo, type ComponentType, type ReactNode } from "react";
import type { EditAtom } from "../edit-atom";
import type { EventComponent, EventData } from "@evnt/schema";
import { Button, Group, Input, Menu, Paper, Stack, Text, Title } from "@mantine/core";
import { IconChevronDown, IconLink } from "@tabler/icons-react";
import { EditComponent } from "./EditComponent";
import { focusAtom } from "jotai-optics";

const componentTypes: {
	icon: ComponentType<{ size?: number }>;
	label: ReactNode;
	desc: ReactNode;
	data: EventComponent;
}[] = [
		{
			icon: IconLink,
			label: "Link",
			desc: "Registration page, livestream, social media page or any relevant link.",
			data: { type: "link", data: { url: "" } },
		},
	];

export const EditComponentsList = ({ data }: { data: EditAtom<EventData> }) => {
	const indexes = useAtomValue(useMemo(() => atom((get) => {
		return (get(data).components ?? []).map((_, i) => i);
	}), [data]));

	const addComponent = useSetAtom(useMemo(() => atom(null, (get, set, component: EventComponent) => {
		set(data, prev => ({
			...prev,
			components: [...(prev.components ?? []), component],
		}));
	}), [data]));

	return (
		<Stack gap={4}>
			<Group gap={4} justify="space-between">
				<Title order={3}>
					Components ({indexes.length})
				</Title>
				<Menu>
					<Menu.Target>
						<Button rightSection={<IconChevronDown size={18} />}>
							Add
						</Button>
					</Menu.Target>
					<Menu.Dropdown>
						{componentTypes.map(({ icon: Icon, data, label, desc }, i) => (
							<Menu.Item
								key={i}
								leftSection={<Icon size={18} />}
								onClick={() => addComponent(data)}
							>
								<Stack gap={0}>
									<Input.Label>{label}</Input.Label>
									<Input.Description>{desc}</Input.Description>
								</Stack>
							</Menu.Item>
						))}
					</Menu.Dropdown>
				</Menu>
			</Group>
			{indexes.length === 0 && (
				<Paper bg="dark" p="md" py="xl" ta="center">
					<Stack h="100%" align="center" justify="center">
						<Text c="dimmed">
							No components added yet!
						</Text>
						<Text c="dimmed" fz="xs">
							Components define additional content or metadata of the event, such as links, images, or custom sections.
						</Text>
					</Stack>
				</Paper>
			)}
			{indexes.map((i) => (
				<EditComponent
					key={i}
					data={data}
					component={focusAtom(data, o => o.prop("components").valueOr([]).at(i)) as EditAtom<EventComponent>}
				/>
			))}
		</Stack >
	);
};

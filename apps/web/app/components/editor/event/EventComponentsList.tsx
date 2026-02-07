import { atom, useAtomValue } from "jotai";
import { useMemo } from "react";
import type { EditAtom } from "../edit-atom";
import type { EventData } from "@evnt/schema";
import { Button, Group, Paper, Stack, Text, Title } from "@mantine/core";

export const EventComponentsList = ({ data }: { data: EditAtom<EventData> }) => {
	const indexes = useAtomValue(useMemo(() => atom((get) => {
		return (get(data).components ?? []).map((_, i) => i);
	}), [data]));

	return (
		<Stack gap={4}>
			<Group gap={4} justify="space-between">
				<Title order={3}>
					Components ({indexes.length})
				</Title>
				<Button
					disabled
				>
					Add Component (TODO)
				</Button>
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
			{/* {indexes.map((i) => (
					<EditComponent
						key={i}
						data={data}
						component={focusAtom(data, o => o.prop("components").valueOr([]).at(i)) as EditAtom<Component>}
					/>
				))} */}
		</Stack>
	);
};

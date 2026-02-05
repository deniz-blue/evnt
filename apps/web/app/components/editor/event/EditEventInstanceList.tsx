import type { EventData, EventInstance } from "@evnt/schema";
import { Button, Group, Stack, Title } from "@mantine/core";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { EditEventInstance } from "./EditEventInstance";
import { focusAtom } from "jotai-optics";
import type { EditAtom } from "../edit-atom";
import { useMemo } from "react";

export const EditEventInstanceList = ({ data }: { data: EditAtom<EventData> }) => {
	const length = useAtomValue(useMemo(() => atom((get) => get(data).instances?.length ?? 0), [data]));
	const setData = useSetAtom(data);

	return (
		<Stack>
			<Title order={3}>
				Instances ({length})
			</Title>

			{new Array(length).fill(0).map((_, i) => (
				<EditEventInstance
					key={i}
					data={focusAtom(data, o => o.prop("instances").valueOr([]).at(i)) as EditAtom<EventInstance>}
					onDelete={() => setData(prev => ({
						...prev,
						instances: (prev.instances ?? []).filter((_, index) => index !== i),
					}))}
				/>
			))}

			<Group justify="end">
				<Button
					onClick={() => {
						const newInstance: EventInstance = {
							venueIds: [],
						};

						setData((prev) => ({
							...prev,
							instances: [...(prev.instances ?? []), newInstance],
						}));
					}}
				>
					Add Instance
				</Button>
			</Group>
		</Stack>
	);
};

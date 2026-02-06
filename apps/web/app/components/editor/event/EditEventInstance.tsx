import type { EventInstance, PartialDate } from "@evnt/schema";
import { CloseButton, Group, Input, Paper, SimpleGrid, Stack, Text } from "@mantine/core";
import { DeatomOptional, type EditAtom } from "../edit-atom";
import { PartialDateInput } from "../../base/input/PartialDateInput";
import { focusAtom } from "jotai-optics";
import { IconCalendar } from "@tabler/icons-react";

export const EditEventInstance = ({ data, onDelete }: { data: EditAtom<EventInstance>, onDelete: () => void }) => {
	return (
		<Stack>
			<Paper withBorder p="xs">
				<Stack>
					<Group justify="space-between">
						<Group gap={4} align="center" c="dimmed">
							<IconCalendar />
							<Text inherit span fw="bold">Event Instance</Text>
						</Group>
						<CloseButton
							onClick={onDelete}
						/>
					</Group>

					<SimpleGrid type="container" cols={{ base: 1, "450px": 2 }}>
						{(["start", "end"] as const).map((field) => (
							<Stack gap={0} key={field}>
								<Input.Label>{field == "start" ? "Start Date & Time" : "End Date & Time"}</Input.Label>
								<DeatomOptional
									component={PartialDateInput}
									atom={focusAtom(data, o => o.prop(field))}
									set={() => new Date().getFullYear().toString() as PartialDate.Year}
									withDeleteButton={false}
								/>
							</Stack>
						))}
					</SimpleGrid>
				</Stack>
			</Paper>
		</Stack>
	);
};

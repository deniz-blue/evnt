import type { EventInstance, PartialDate } from "@evnt/schema";
import { CloseButton, Group, Paper, Stack, Text } from "@mantine/core";
import { Deatom, DeatomOptional, type EditAtom } from "../edit-atom";
import { PartialDateInput } from "../../base/input/PartialDateInput";
import { focusAtom } from "jotai-optics";

export const EditEventInstance = ({ data, onDelete }: { data: EditAtom<EventInstance>, onDelete: () => void }) => {
	return (
		<Stack>
			<Paper withBorder p="xs">
				<Stack>
					<Group justify="space-between">
						<Text>Event Instance</Text>
						<CloseButton
							onClick={onDelete}
						/>
					</Group>

					{(["start", "end"] as const).map((field) => (
						<Group key={field} grow>
							<Text>
								{field == "start" ? "Start" : "End"}
							</Text>
							<DeatomOptional
								component={PartialDateInput}
								atom={focusAtom(data, o => o.prop(field))}
								set={() => new Date().toISOString().split("T")[0] as PartialDate}
							/>
						</Group>
					))}
				</Stack>
			</Paper>
		</Stack>
	);
};

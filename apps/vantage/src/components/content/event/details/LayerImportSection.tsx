import { Button, Stack } from "@mantine/core";
import { useLayersStore } from "../../../../db/useLayersStore";
import { type EventSource } from "../../../../db/models/event-source";
import { EventActions } from "../../../../lib/actions/event-actions";
import { AsyncAction } from "../../../data/AsyncAction";

export const LayerImportSection = ({ source }: { source: EventSource }) => {
	const layerDefaultSources = useLayersStore((store) => store.layers.default?.data.events);

	const isOnDefault = layerDefaultSources?.includes(source);

	if (isOnDefault) return null;

	return (
		<Stack>
			<AsyncAction action={async () => {
				await EventActions.createEventFromSource(source);
			}}>
				{({ loading, onClick }) => (
					<Button
						fullWidth
						onClick={onClick}
						loading={loading}
						color="green"
					>
						Add to saved events
					</Button>
				)}
			</AsyncAction>
		</Stack>
	);
};

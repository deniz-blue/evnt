import { Button, Stack } from "@mantine/core";
import { useLayersStore } from "../../../../db/useLayersStore";
import { UtilEventSource, type EventDataSource } from "../../../../db/models/event-source";
import { EventActions } from "../../../../lib/actions/events";
import { AsyncAction } from "../../../data/AsyncAction";

export const LayerImportSection = ({ source }: { source: EventDataSource }) => {
	const layerDefaultSources = useLayersStore((store) => store.layers.default?.data.events);

	const isOnDefault = layerDefaultSources?.includes(source);

	return (
		<Stack>
			{!isOnDefault && (
				<AsyncAction action={async () => {
					await EventActions.createRemoteEventFromUrl(source);
				}}>
					{({ loading, onClick }) => (
						<Button
							fullWidth
							onClick={onClick}
							loading={loading}
						>
							Add to saved events
						</Button>
					)}
				</AsyncAction>
			)}
		</Stack>
	);
};

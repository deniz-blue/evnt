import { Button, Stack } from "@mantine/core";
import { useLayersStore } from "../../../../db/useLayersStore";
import { UtilEventSource, type EventDataSource } from "../../../../db/models/event-source";
import { EventActions } from "../../../../db/events";
import { AsyncAction } from "../../../data/AsyncAction";

export const LayerImportSection = ({ source }: { source: EventDataSource }) => {
	const layerDefaultSources = useLayersStore((store) => store.layers.default?.data.events);

	const isOnDefault = layerDefaultSources?.some(x => UtilEventSource.equals(x, source));

	return (
		<Stack>
			{!isOnDefault && (
				<AsyncAction action={async () => {
					if (source.type != "remote") return;
					await EventActions.createRemoteEventFromUrl(source.url);
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

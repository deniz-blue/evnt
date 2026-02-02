import { useState } from "react";
import { useEventDetailsModal } from "../../../../hooks/app/useEventDetailsModal";
import { BaseOverlay } from "../base/BaseOverlay";
import { type EventData } from "@evnt/schema";
import { EventDetailsContent } from "../../../content/event/details/EventDetailsContent";
import { useEventDataQuery } from "../../../../db/useEventDataQuery";
import { UtilEventSource, type EventDataSource } from "../../../../db/models/event-source";
import { Code, Stack, Text } from "@mantine/core";
import { RQResult } from "../../../data/RQResult";

export const EventDetailsOverlay = () => {
	const { isOpen, close, value: source } = useEventDetailsModal();

	return (
		<BaseOverlay
			opened={isOpen}
			onClose={close}
		>
			{source && UtilEventSource.is(source) ? (
				<EventDetailsOverlayHandler source={source} />
			) : (
				<Stack>
					<Text>
						Invalid event source: <Code>{source}</Code>
					</Text>
				</Stack>
			)}
		</BaseOverlay>
	)
};

export const EventDetailsOverlayHandler = ({ source }: { source: EventDataSource }) => {
	const [data, setData] = useState<EventData | null>(null);

	const query = useEventDataQuery(source);

	return (
		<RQResult query={query}>
			{(data) => (
				<EventDetailsContent
					data={data}
					source={source}
				/>
			)}
		</RQResult>
	);
};

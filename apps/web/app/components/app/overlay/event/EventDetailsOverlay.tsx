import { useEventDetailsModal } from "../../../../hooks/app/useEventDetailsModal";
import { BaseOverlay } from "../base/BaseOverlay";
import { EventDetailsContent } from "../../../content/event/details/EventDetailsContent";
import { useEventQuery } from "../../../../db/useEventQuery";
import { UtilEventSource, type EventSource } from "../../../../db/models/event-source";
import { Code, Stack, Text } from "@mantine/core";
import { RQResult } from "../../../data/RQResult";

export const EventDetailsOverlay = () => {
	const { isOpen, close, value: source } = useEventDetailsModal();

	return (
		<BaseOverlay
			opened={isOpen}
			onClose={close}
		>
			{source && UtilEventSource.is(source, true) ? (
				<EventDetailsOverlayHandler source={source} />
			) : (
				<Stack>
					<Text>
						Invalid event source: <Code>{source}</Code>
					</Text>
				</Stack>
			)}
		</BaseOverlay>
	);
};

export const EventDetailsOverlayHandler = ({ source }: { source: EventSource }) => {
	const query = useEventQuery(source);

	return (
		<RQResult query={query}>
			{({ data, err }) => data && (
				<EventDetailsContent
					data={data}
					source={source}
					err={err}
					loading={query.isFetching}
				/>
			)}
		</RQResult>
	);
};

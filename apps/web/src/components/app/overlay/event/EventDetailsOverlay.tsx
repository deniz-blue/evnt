import { useEventDetailsModal } from "../../../../hooks/app/useEventDetailsModal";
import { BaseOverlay } from "../base/BaseOverlay";
import { EventDetailsContent } from "../../../content/event/details/EventDetailsContent";
import { useEventQuery } from "../../../../db/useEventQuery";
import { UtilEventSource, type EventSource } from "../../../../db/models/event-source";
import { Code, Stack, Text } from "@mantine/core";
import { RQResult } from "../../../data/RQResult";
import { EventEnvelopeProvider } from "../../../content/event/event-envelope-context";

export const EventDetailsOverlay = () => {
	const { close, useValue } = useEventDetailsModal();
	const source = useValue();

	return (
		<BaseOverlay
			opened={!!source}
			onClose={close}
			modalBodyProps={{ p: 0 }}
		>
			{source && UtilEventSource.is(source, true) ? (
				<EventDetailsOverlayHandler source={source} />
			) : (
				<Stack align="center" justify="center" h="100%" ta="center">
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
			{(envelope) => (
				<EventEnvelopeProvider value={envelope}>
					<EventDetailsContent
						source={source}
						loading={query.isFetching}
						withModalCloseButton
					/>
				</EventEnvelopeProvider>
			)}
		</RQResult>
	);
};

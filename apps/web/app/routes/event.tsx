import { useSearchParams } from "react-router";
import { UtilEventSource } from "../db/models/event-source";
import { Center, Stack } from "@mantine/core";
import { EventDetailsContent } from "../components/content/event/details/EventDetailsContent";
import { useEventQueries } from "../db/useEventQuery";
import type { EventEnvelope } from "../db/models/event-envelope";

export default function EventPage() {
	const [searchParams] = useSearchParams();
	const source = searchParams.get("source");

	const isValidSource = source && UtilEventSource.is(source, true);

	const [query] = useEventQueries(isValidSource ? [source] : []);

	if (!isValidSource) return (
		<Center>
			Invalid event source!
		</Center>
	);

	return (
		<Stack>
			<EventDetailsContent
				source={source}
				{...query?.query?.data ?? {
					data: null,
				} as EventEnvelope}
			/>
		</Stack>
	);
}

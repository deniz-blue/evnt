import { SimpleGrid, Stack } from "@mantine/core";
import type { EventQueryResult } from "../../../db/useEventQuery";
import { EventCard } from "../event/card/EventCard";
import { EventContextMenu } from "../event/EventContextMenu";
import { EventEnvelopeProvider } from "../event/event-envelope-context";

export const EventsGrid = ({
	queries,
}: {
	queries: EventQueryResult[];
}) => {
	return (
		<Stack>
			<SimpleGrid
				type="container"
				cols={{ base: 1, "680px": 2, "1400px": 3, "1800px": 4 }}
				data-grow
				data-hover
			>
				{queries.map(({ query, source }, index) => (
					<EventEnvelopeProvider
						key={index}
						value={query.data ?? { data: null }}
					>
						<EventCard
							variant="card"
							source={source}
							loading={query.isFetching}
							menu={<EventContextMenu source={source} />}
						/>
					</EventEnvelopeProvider>
				))}
			</SimpleGrid>
		</Stack>
	);
};

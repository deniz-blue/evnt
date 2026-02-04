import { SimpleGrid, Stack } from "@mantine/core";
import type { EventQueryResult } from "../../../db/useEventQuery";
import { EventCard } from "../event/EventCard";
import { EventContextMenu } from "../event/EventContextMenu";

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
			>
				{queries.map(({ query, source }, index) => (
					<EventCard
						key={index}
						variant="card"
						source={source}
						loading={query.isFetching}
						menu={<EventContextMenu source={source} />}
						{...query.data}
						data={query.data?.data ?? null}
					/>
				))}
			</SimpleGrid>
		</Stack>
	);
};

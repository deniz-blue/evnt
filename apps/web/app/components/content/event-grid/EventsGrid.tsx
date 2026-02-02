import { SimpleGrid, Stack } from "@mantine/core";
import type { EventQueryResult } from "../../../db/useEventQuery";
import { RQResult } from "../../data/RQResult";
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
					<RQResult
						key={index}
						query={query}
					>
						{({ data, err }) => data && (
							<EventCard
								key={index}
								value={data}
								variant="card"
								source={source}
								err={err}
								menu={<EventContextMenu source={source} />}
							/>
						)}
					</RQResult>
				))}
			</SimpleGrid>
		</Stack>
	);
};

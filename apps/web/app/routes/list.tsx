import { ActionIcon, Button, Group, Menu, SimpleGrid, Stack, TextInput } from "@mantine/core";
import { useState } from "react";
import { EventDataSchema } from "@evnt/schema";
import { openImportJSONModal } from "../components/app/modal/ImportJSONModal";
import { IconBraces, IconLink, IconPlus } from "@tabler/icons-react";
import { EventCard } from "../components/content/event/EventCard";
import { openEventImportURLModal } from "../components/app/modal/ImportURLModal";
import { useEventQueries } from "../db/useEventDataQuery";
import { RQResult } from "../components/data/RQResult";
import { EventActions } from "../lib/actions/events";
import { EventContextMenu } from "../components/content/event/EventContextMenu";
import { useLayersStore } from "../db/useLayersStore";
import { applyEventFilters, EventFilters } from "../lib/filter/event-filters";

export default function List() {
	const defaultLayerSources = useLayersStore(store => store.layers["default"]?.data.events ?? []);

	const [search, setSearch] = useState("");

	const allQueries = useEventQueries(defaultLayerSources);
	const filtered = applyEventFilters(allQueries, [
		(search && search.length > 0) ? EventFilters.Search(search) : EventFilters.None,
	]);

	return (
		<Stack>
			<Stack>
				<Group>
					<Group flex="1">
						<TextInput
							placeholder="Search events..."
							value={search}
							onChange={(event) => setSearch(event.currentTarget.value)}
						/>
					</Group>
					<Group>
						<Menu>
							<Menu.Target>
								<Button leftSection={<IconPlus />}>
									Add
								</Button>
							</Menu.Target>
							<Menu.Dropdown>
								<Menu.Item
									leftSection={<IconBraces />}
									onClick={() => {
										openImportJSONModal({
											schema: EventDataSchema,
											onSubmit: (data) => {
												EventActions.createLocalEvent(data);
											},
										});
									}}
								>
									From JSON content
								</Menu.Item>
								<Menu.Item
									leftSection={<IconLink />}
									onClick={() => {
										openEventImportURLModal({
											onSubmit: (url, data) => {
												EventActions.createRemoteEvent(url, data);
											},
										});
									}}
								>
									From URL
								</Menu.Item>
							</Menu.Dropdown>
						</Menu>
					</Group>
				</Group>
			</Stack>

			<SimpleGrid
				type="container"
				cols={{ base: 1, "680px": 2, "1400px": 3, "1800px": 4 }}
			>
				{filtered.map(({ query, source }, index) => (
					<RQResult
						key={index}
						query={query}
					>
						{({ data }) => data && (
							<EventCard
								key={index}
								value={data}
								variant="card"
								source={source}
								menu={<EventContextMenu source={source} />}
							/>
						)}
					</RQResult>
				))}
			</SimpleGrid>
		</Stack>
	);
};

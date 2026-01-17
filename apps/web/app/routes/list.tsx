import { ActionIcon, Group, Menu, SimpleGrid, Stack, TextInput } from "@mantine/core";
import { useState } from "react";
import { EventDataSchema } from "@evnt/schema";
import { openImportJSONModal } from "../components/app/modal/ImportJSONModal";
import { IconPlus } from "@tabler/icons-react";
import { EventCard } from "../components/content/event/EventCard";
import { openImportURLModal } from "../components/app/modal/ImportURLModal";
import { useEventQueries } from "../db/useEventDataQuery";
import { RQResult } from "../components/data/RQResult";
import { EventActions } from "../db/events";
import { EventContextMenu } from "../components/content/event/EventContextMenu";
import { useLayersStore } from "../db/useLayersStore";
import { UtilTranslations } from "@evnt/schema/utils";

export default function List() {
	const defaultLayerSources = useLayersStore(store => store.layers["default"]?.data.events ?? []);

	const events = useEventQueries(defaultLayerSources);

	const [search, setSearch] = useState("");

	let filtered = events;

	if (search) {
		filtered = filtered.filter(({ query }) => {
			return [
				query.data?.name ?? {},
				query.data?.description ?? {},
			].some(translation => !!UtilTranslations.search(translation, search))
		});
	};

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
								<ActionIcon>
									<IconPlus />
								</ActionIcon>
							</Menu.Target>
							<Menu.Dropdown>
								<Menu.Item
									onClick={() => {
										openImportJSONModal({
											schema: EventDataSchema,
											onSubmit: (data) => {
												EventActions.createLocalEvent(data);
											},
										});
									}}
								>
									Add JSON
								</Menu.Item>
								<Menu.Item
									onClick={() => {
										openImportURLModal({
											schema: EventDataSchema,
											onSubmit: (url, data) => {
												EventActions.createRemoteEvent(url, data);
											},
										});
									}}
								>
									Add URL
								</Menu.Item>
							</Menu.Dropdown>
						</Menu>
					</Group>
				</Group>
			</Stack>

			<SimpleGrid
				type="container"
				cols={{ base: 1, '300px': 2, '500px': 4 }}
			>
				{filtered.map(({ query, source }, index) => (
					<RQResult
						key={index}
						query={query}
					>
						{(data) => (
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

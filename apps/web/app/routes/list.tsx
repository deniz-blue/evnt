import { Button, Group, Menu, Stack, TextInput } from "@mantine/core";
import { useState } from "react";
import { EventDataSchema } from "@evnt/schema";
import { openImportJSONModal } from "../components/app/modal/ImportJSONModal";
import { IconBraces, IconEdit, IconLink, IconPlus } from "@tabler/icons-react";
import { openEventImportURLModal } from "../components/app/modal/ImportURLModal";
import { useEventQueries } from "../db/useEventQuery";
import { EventActions } from "../lib/actions/event-actions";
import { useLayersStore } from "../db/useLayersStore";
import { applyEventFilters, EventFilters } from "../lib/filter/event-filters";
import { EventsGrid } from "../components/content/event-grid/EventsGrid";
import { Link } from "react-router";

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
					<Group gap={4}>
						<Menu>
							<Menu.Target>
								<Button leftSection={<IconPlus />}>
									Add
								</Button>
							</Menu.Target>
							<Menu.Dropdown>
								<Menu.Item
									leftSection={<IconLink />}
									onClick={() => {
										openEventImportURLModal({
											onSubmit: (source) => {
												EventActions.createEventFromSource(source);
											},
										});
									}}
								>
									From URL
								</Menu.Item>
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
							</Menu.Dropdown>
						</Menu>
						<Button
							component={Link}
							to="/new"
							leftSection={<IconEdit />}
							color="green"
						>
							New
						</Button>
					</Group>
				</Group>
			</Stack>

			<EventsGrid queries={filtered} />
		</Stack>
	);
};

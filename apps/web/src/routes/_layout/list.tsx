import { useSet } from "@mantine/hooks";
import { createFileRoute, Link } from "@tanstack/react-router"
import { useLayersStore } from "../../db/useLayersStore";
import { useShallow } from "zustand/react/shallow";
import { useState } from "react";
import { useEventQueries } from "../../db/useEventQuery";
import { applyEventFilters, EventFilters } from "../../lib/filter/event-filters";
import { ActionIcon, Button, Group, Menu, Stack, TextInput, Tooltip } from "@mantine/core";
import { IconBraces, IconEdit, IconLink, IconPlus } from "@tabler/icons-react";
import { openEventImportURLModal } from "../../components/app/modal/ImportURLModal";
import { EventActions } from "../../lib/actions/event-actions";
import { openImportJSONModal } from "../../components/app/modal/ImportJSONModal";
import { EventDataSchema } from "@evnt/schema";
import { EventsGrid } from "../../components/content/event-grid/EventsGrid";

export const Route = createFileRoute("/_layout/list")({
	component: ListPage,
})

function ListPage() {
	const selectedLayerIds = useSet<string>(["default"]);

	const layerIds = useLayersStore(
		useShallow(store => Object.keys(store.layers))
	)

	const sources = useLayersStore(
		useShallow(store => Array.from(new Set(
			Array.from(selectedLayerIds).map(id => store.layers[id]?.data.events || []).flat()
		)))
	)

	const [search, setSearch] = useState("");

	const allQueries = useEventQueries(sources);
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
								<Tooltip label="Add from...">
									<ActionIcon size="input-sm">
										<IconPlus />
									</ActionIcon>
								</Tooltip>
							</Menu.Target>
							<Menu.Dropdown>
								<Menu.Item
									leftSection={<IconLink />}
									onClick={() => {
										openEventImportURLModal({
											onSubmit: (source) => {
												EventActions.createEventFromSource(source);
											},
										})
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
										})
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
	)
}

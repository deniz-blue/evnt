import { useSet } from "@mantine/hooks";
import { createFileRoute, Link } from "@tanstack/react-router"
import { useLayersStore } from "../../db/useLayersStore";
import { useMemo, useState } from "react";
import { useEventQueries } from "../../db/useEventQuery";
import { applyEventFilters, EventFilters } from "../../lib/filter/event-filters";
import { ActionIcon, Button, Checkbox, Combobox, Group, Indicator, InputBase, Menu, MultiSelect, Paper, Stack, TextInput, Tooltip, useCombobox } from "@mantine/core";
import { IconBraces, IconEdit, IconLink, IconPlus } from "@tabler/icons-react";
import { EventActions } from "../../lib/actions/event-actions";
import { EventDataSchema } from "@evnt/schema";
import { EventsGrid } from "../../components/content/event-grid/EventsGrid";
import { modals } from "@mantine/modals";
import type { Layer } from "../../db/models/layer";

export const Route = createFileRoute("/_layout/list")({
	component: ListPage,
})

function ListPage() {
	const [selectedLayerIds, setSelectedLayerIds] = useState<string[]>(["default"]);
	const layers = useLayersStore(store => store.layers);

	const sources = useMemo(() => {
		return Array.from(new Set(
			Array.from(selectedLayerIds).map(id => layers[id]?.data.events || []).flat()
		));
	}, [layers, selectedLayerIds])

	const [search, setSearch] = useState("");

	const allQueries = useEventQueries(sources);
	const filtered = applyEventFilters(allQueries, [
		(search && search.length > 0) ? EventFilters.Search(search) : EventFilters.None,
	]);

	const top = "calc(var(--app-shell-header-height, 0px) + var(--app-shell-padding) + var(--safe-area-inset-top))";
	return (
		<Stack>
			<Paper pos="sticky" top={top} p={4} withBorder shadow="md" style={{ zIndex: 5 }}>
				<Group gap={4}>
					<Group gap={4} flex="1">
						<TextInput
							placeholder="Search events..."
							value={search}
							onChange={(event) => setSearch(event.currentTarget.value)}
						/>
						<LayersSelect
							layers={layers}
							value={selectedLayerIds}
							onChange={(values) => {
								setSelectedLayerIds(values);
							}}
						/>
					</Group>
					<Group gap={4}>

					</Group>
				</Group>
			</Paper>

			<EventsGrid queries={filtered} />
		</Stack >
	)
}

export const LayersSelect = ({
	layers,
	onChange,
	value,
}: {
	layers: Record<string, Layer>;
	value: string[];
	onChange: (values: string[]) => void;
}) => {
	const combobox = useCombobox();

	const options = Object.keys(layers).map((layerId) => (
		<Combobox.Option value={layerId} key={layerId}>
			<Group gap={4} wrap="nowrap">
				<Checkbox
					checked={value.includes(layerId)}
					readOnly
				/>

				{layerId}
			</Group>
		</Combobox.Option>
	));

	return (
		<Combobox
			store={combobox}
			onOptionSubmit={(id) => {
				onChange(value.includes(id) ? value.filter(v => v !== id) : [...value, id]);
			}}
			width="max-content"
		>
			<Combobox.Target>
				<Indicator
					label={value.length}
					size={16}
					color="gray.7"
					disabled={value.length <= 1}
					offset={4}
				>
					<InputBase
						component="button"
						type="button"
						pointer
						rightSection={<Combobox.Chevron />}
						rightSectionPointerEvents="none"
						onClick={() => combobox.toggleDropdown()}
					>
						{value.length === 1 ? value[0] : "Layers..."}
					</InputBase>
				</Indicator>
			</Combobox.Target>
			<Combobox.Dropdown>
				<Combobox.Options>
					{options}
				</Combobox.Options>
			</Combobox.Dropdown>
		</Combobox>
	);
};

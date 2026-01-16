import { ActionIcon, Group, Menu, SimpleGrid, Stack, TextInput } from "@mantine/core";
import { useState } from "react";
import { EventDataSchema } from "@evnt/schema";
import { openImportJSONModal } from "../components/app/modal/ImportJSONModal";
import { IconPlus } from "@tabler/icons-react";
import { EventCard } from "../components/content/event/EventCard";
import { openImportURLModal } from "../components/app/modal/ImportURLModal";
import { useQueries, useQuery } from "@tanstack/react-query";
import { DataDB } from "../db/data-db";
import { eventDataQueryOptions } from "../db/useEventDataQuery";
import { UtilEventSource } from "../db/models/event-source";
import { RQResult } from "../components/data/RQResult";
import { EventUtils } from "../db/events";

export default function List() {
	const dbKeys = useQuery({
		queryKey: ["event-data-keys"],
		queryFn: () => DataDB.getAllKeys(),
	});

	console.log("Event data keys:", dbKeys.data);

	const events = useQueries({
		queries: (dbKeys.data ?? []).map((key) => (
			eventDataQueryOptions(UtilEventSource.fromKey(key)!)
		)),
	});

	const [search, setSearch] = useState("");

	// let filtered = events;

	// if (search) {
	//     filtered = filtered.filter((event) => {
	//         return [
	//             event.data.name,
	//             event.data.description,
	//         ].some(translation => !!UtilTranslations.search(translation, search))
	//     });
	// };

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
												EventUtils.createLocalEvent(data);
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
												EventUtils.createRemoteEvent(url, data);
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
				{/* {filtered.map((event, index) => (
                    <EventCard
                        key={index}
                        value={event.data}
                        variant="card"
                        id={event.id}
                        menu={<EventContextMenu event={event} />}
                    />
                ))} */}
				{events.map((eventQuery, index) => (
					<RQResult
						key={index}
						query={eventQuery}
					>
						{(data) => (
							<EventCard
								key={index}
								value={data}
								variant="card"
								id={0}
							/>
						)}
					</RQResult>
				))}
			</SimpleGrid>
		</Stack>
	);
};

import { ActionIcon, Group, Menu, SimpleGrid, Stack, TextInput } from "@mantine/core";
import { useEventStore } from "../lib/stores/useEventStore";
import { EventCard } from "../components/event/EventCard";
import { useState } from "react";
import { EventDataSchema } from "@repo/model";
import { UtilTranslations } from "@repo/model/utils";
import { openImportJSONModal } from "../components/modal/ImportJSONModal";
import { IconPlus } from "@tabler/icons-react";

export default function List() {
    const events = useEventStore((state) => state.events);

    const [search, setSearch] = useState("");

    let filtered = events;

    if (search) {
        filtered = filtered.filter((event) => {
            return [
                event.data.name,
                event.data.description,
            ].some(translation => !!UtilTranslations.search(translation, search))
        });
    };

    console.log({ filtered });

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
                                                useEventStore.getState().createLocalEvent(data);
                                            },
                                        });
                                    }}
                                >
                                    Add JSON
                                </Menu.Item>
                                <Menu.Item>
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
                {filtered.map((event, index) => (
                    <EventCard
                        key={index}
                        value={event.data}
                        variant="card"
                        id={event.id}
                    />
                ))}
            </SimpleGrid>
        </Stack>
    );
};

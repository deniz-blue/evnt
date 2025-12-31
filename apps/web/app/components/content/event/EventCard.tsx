import { Group, Paper, Stack, Text } from "@mantine/core";
import { Trans } from "./Trans";
import type { EventData } from "@repo/model";
import { EventInstanceList } from "./EventInstanceList";
import { EventContextMenu } from "./EventContextMenu";

export const EventCard = ({
    variant = "card",
    value,
    id,
}: {
    variant?: "horizontal" | "card";
    value: EventData;
    id?: number;
}) => {
    return (
        <Paper
            p="xs"
            withBorder
        >
            <Stack>
                <Group>
                    <Stack gap={0} flex="1">
                        <Text fw="bold" span>
                            <Trans t={value.name} />
                        </Text>
                        <Text fz="sm" c="dimmed" inline span>
                            <Trans t={value.description} />
                        </Text>
                    </Stack>
                    <EventContextMenu value={value} id={id} />
                </Group>

                {variant === "card" && (
                    <EventInstanceList value={value} />
                )}
            </Stack>
        </Paper>
    )
};

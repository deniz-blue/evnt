import { Paper, Stack, Text, Title } from "@mantine/core";
import { Trans } from "./Trans";
import type { EventData } from "@repo/model";
import { EventInstanceList } from "./EventInstanceList";

export const EventCard = ({
    variant = "card",
    value,
}: {
    variant?: "horizontal" | "card";
    value: EventData;
}) => {
    return (
        <Paper
            p="xs"
            withBorder
        >
            <Stack>
                <Stack gap={0}>
                    <Text fw="bold" span>
                        <Trans t={value.name} />
                    </Text>
                    <Text fz="sm" c="dimmed" inline span>
                        <Trans t={value.description} />
                    </Text>
                </Stack>

                {variant === "card" && (
                    <EventInstanceList value={value} />
                )}
            </Stack>
        </Paper>
    )
};

import { Group, Paper, Stack, Text } from "@mantine/core";
import { Trans } from "./Trans";
import type { EventData } from "@evnt/schema";
import { EventInstanceList } from "./EventInstanceList";
import { EventContextMenu } from "./EventContextMenu";
import { SubtleLink } from "../base/SubtleLink";

export const EventCard = ({
    variant = "card",
    value,
    id,
    menu,
}: {
    variant?: "horizontal" | "card";
    value: EventData;
    id?: number;
    menu?: React.ReactNode;
}) => {
    return (
        <Paper
            p="xs"
            withBorder
            w="100%"
            h={variant === "card" ? "100%" : undefined}
        >
            <Stack>
                <Group>
                    <Stack gap={0} flex="1">
                        <SubtleLink if={!!id} to={`?eventId=${id}`}>
                            <Text fw="bold" span>
                                <Trans t={value.name} />
                            </Text>
                        </SubtleLink>
                        <Text fz="sm" c="dimmed" inline span>
                            <Trans t={value.description} />
                        </Text>
                    </Stack>
                    {menu}
                </Group>

                {variant === "card" && (
                    <EventInstanceList value={value} />
                )}
            </Stack>
        </Paper>
    )
};

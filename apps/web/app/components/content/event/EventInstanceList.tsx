import { Group, Stack, Text } from "@mantine/core";
import { IconCalendar, IconClock, IconGlobe, IconMapPin } from "@tabler/icons-react";
import type { EventData } from "@evnt/schema";
import { Trans } from "./Trans";
import { CountryFlag } from "../../content/address/CountryFlag";
import { UtilPartialDate } from "@evnt/schema/utils";

export const EventInstanceList = ({ value }: { value: EventData }) => {
    return (
        <Stack>
            {value.venues.map((venue, venueIndex) => (
                <Group key={venueIndex} gap={4}>
                    {venue.venueType === "physical" && <IconMapPin />}
                    {venue.venueType === "online" && <IconGlobe />}
                    <Stack gap={0}>
                        <Text inline span>
                            <Trans t={venue.venueName} />
                        </Text>
                        {venue.venueType === "physical" && venue.address && (
                            <Text fz="sm" c="dimmed" span>
                                {venue.address.addr} {venue.address.countryCode && (
                                    <CountryFlag countryCode={venue.address.countryCode} />
                                )}
                            </Text>
                        )}
                    </Stack>
                </Group>
            ))}

            {value.instances.map((instance, instanceIndex) => (
                <Stack key={instanceIndex} gap={0}>
                    <Group gap={4}>
                        <IconCalendar />
                        <Text inline span>
                            {instance.start && UtilPartialDate.toIntlDateString(instance.start, { weekday: "short" })}
                        </Text>
                    </Group>
                    <Group gap={4}>
                        <IconClock />
                        <Text inline span>
                            {instance.start && UtilPartialDate.toIntlTimeString(instance.start)}
                        </Text>
                    </Group>
                </Stack>
            ))}
        </Stack>
    );
};

import type { EventData } from "@evnt/schema";
import { Group, Modal, Stack, Text, Title } from "@mantine/core";
import { Trans } from "../Trans";
import { SmallTitle } from "../../base/SmallTitle";
import { snippetInstance, snippetVenue, venueGoogleMapsLink, venueOpenStreetMapsLink } from "@evnt/pretty";
import { Snippet } from "../../Snippet";

export const EventDetailsContent = ({
    data,
    id,
}: {
    data: EventData;
    id?: number;
}) => {
    return (
        <Stack>
            <Group gap={4}>
                <Title flex="1">
                    <Trans t={data.name} />
                </Title>
                <Group gap={4}>
                    <Modal.CloseButton />
                </Group>
            </Group>

            <Stack gap={0}>
                <SmallTitle padLeft>
                    venue{data.venues && data.venues.length !== 1 ? "s" : ""}
                </SmallTitle>
                <Stack gap={4}>
                    {data.venues?.map((venue, index) => (
                        <Stack key={index} gap={0}>
                            <Snippet snippet={snippetVenue(venue)} />
                            <Stack gap={0}>
                                {venueGoogleMapsLink(venue) && (
                                    <Snippet snippet={{
                                        sublabel: {
                                            type: "external-link",
                                            name: "View on Google Maps",
                                            url: venueGoogleMapsLink(venue)!,
                                        },
                                    }} />
                                )}
                                {venueOpenStreetMapsLink(venue) && (
                                    <Snippet snippet={{
                                        sublabel: {
                                            type: "external-link",
                                            name: "View on OpenStreetMap",
                                            url: venueOpenStreetMapsLink(venue)!,
                                        },
                                    }} />
                                )}
                            </Stack>
                        </Stack>
                    ))}
                </Stack>
            </Stack>
            <Stack gap={0}>
                <SmallTitle padLeft>
                    date & time
                </SmallTitle>
                <Stack gap={4}>
                    {data.instances?.map((instance, index) => (
                        <Stack key={index} gap={0}>
                            {snippetInstance(instance).map((snippet, snipIndex) => (
                                <Snippet key={snipIndex} snippet={snippet} />
                            ))}
                        </Stack>
                    ))}
                </Stack>
            </Stack>

            {/* <Text>
                Lorem ipsum:
            </Text>
            {Array(50).fill(0).map((_, index) => (
                <Text key={index} fz="sm" c="dimmed" inline>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Text>
            ))} */}
        </Stack>
    );
};

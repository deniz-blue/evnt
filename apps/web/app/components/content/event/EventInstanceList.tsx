import { Group, Stack, Text } from "@mantine/core";
import type { EventData } from "@evnt/schema";
import { snippetEvent } from "@evnt/pretty";
import { Snippet } from "../Snippet";

export const EventInstanceList = ({ value }: { value: EventData }) => {
    const snippets = snippetEvent(value, {
        maxVenues: 3,
    });

    return (
        <Stack gap={4}>
            {snippets.map((snippet, index) => (
                <Snippet key={index} snippet={snippet} />
            ))}
        </Stack>
    );
}

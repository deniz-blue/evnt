import type { Range } from "@evnt/pretty";
import { Text } from "@mantine/core";
import { TimeSnippetLabel } from "./TimeSnippetLabel";

export const TimeRangeSnippetLabel = ({ value }: { value: Range<string> }) => {
    return (
        <Text span inline>
            <TimeSnippetLabel value={value.start} /> - <TimeSnippetLabel value={value.end} />
        </Text>
    )
};

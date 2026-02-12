import type { SnippetLabelProps } from "@evnt/pretty";
import { Text } from "@mantine/core";
import { TimeSnippetLabel } from "./TimeSnippetLabel";

export const TimeRangeSnippetLabel = ({ value }: SnippetLabelProps<"time-range">) => {
    return (
        <Text span inline>
            <TimeSnippetLabel value={value.start.value} date={value.start.date} /> - <TimeSnippetLabel value={value.end.value} date={value.end.date} />
        </Text>
    )
};

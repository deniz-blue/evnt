import type { PartialDate } from "@evnt/schema";
import { UtilPartialDate } from "@evnt/schema/utils";
import { Text } from "@mantine/core";

export const PartialDateSnippetLabel = ({ value }: { value: PartialDate }) => {
    return (
        <Text span inline>
            {UtilPartialDate.toIntlString(value)}
        </Text>
    )
};

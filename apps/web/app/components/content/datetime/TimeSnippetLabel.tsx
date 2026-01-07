import { Text, Tooltip } from "@mantine/core";

export const TimeSnippetLabel = ({ value }: { value: string }) => {
    return (
        <Tooltip label={`${value} - UTC`}>
            <Text span inline>
                {value}
            </Text>
        </Tooltip>
    );
};

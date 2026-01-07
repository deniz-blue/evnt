import type { SnippetIcon, SnippetLabel, TSnippet } from "@evnt/pretty";
import { Anchor, Box, Group, Stack, Text, Tooltip } from "@mantine/core";
import { useCallback, useMemo, type PropsWithChildren, type ReactNode } from "react";
import { Trans } from "./event/Trans";
import { AddressSnippetLabel } from "./address/AddressSnippetLabel";
import { IconCalendar, IconClock, IconExternalLink, IconMapPin, IconWorld } from "@tabler/icons-react";
import { TimeSnippetLabel } from "./datetime/TimeSnippetLabel";
import { PartialDateSnippetLabel } from "./datetime/PartialDateSnippetLabel";
import { TimeRangeSnippetLabel } from "./datetime/TimeRangeSnippetLabel";
import { PartialDateRangeSnippetLabel } from "./datetime/PartialDateRangeSnippetLabel";

export const Snippet = ({ snippet }: { snippet: TSnippet }) => {
    const icon: ReactNode = ({
        "map-pin": <IconMapPin />,
        calendar: <IconCalendar />,
        website: <IconWorld />,
        clock: <IconClock />,
        _: null,
    } as Partial<Record<SnippetIcon | "_", ReactNode>>)[snippet.icon ?? "_"] ?? null;

    const getLabelNode = useCallback((label?: SnippetLabel) => {
        if (!label) return null;

        if (label.type === "text") return <Text inline span inherit>{label.value}</Text>;
        if (label.type === "translations") return (
            <Text inline span inherit>
                <Trans t={label.value} />
            </Text>
        );
        if (label.type === "address") return <AddressSnippetLabel value={label.value} />;
        if (label.type === "time") return <TimeSnippetLabel value={label.value} />;
        if (label.type === "time-range") return <TimeRangeSnippetLabel value={label.value} />;
        if (label.type === "date-time-range") return <PartialDateRangeSnippetLabel value={label.value} />;
        if (label.type === "partial-date" || label.type == "date-time") return <PartialDateSnippetLabel value={label.value} />;
        if (label.type === "external-link") {
            return (
                <Tooltip label={label.value}>
                    <Anchor inline inherit href={label.value} fz="sm" c="dimmed" target="_blank" rel="noopener noreferrer">
                        {new URL(label.value).hostname} <IconExternalLink size="0.8em" />
                    </Anchor>
                </Tooltip>
            )
        }

        return null;
    }, []);

    let label: ReactNode = useMemo(() => getLabelNode(snippet.label), [snippet.label]);
    let sublabel: ReactNode = useMemo(() => getLabelNode(snippet.sublabel), [snippet.sublabel]);

    return (
        <BaseSnippet icon={icon}>
            {label}
            {sublabel}
        </BaseSnippet>
    );
};

export const BaseSnippet = ({
    icon,
    children,
}: PropsWithChildren<{
    icon?: ReactNode;
}>) => {
    return (
        <Group gap={4} wrap="nowrap" align="start">
            <Box miw={24} mah={24} display="flex">
                {icon}
            </Box>
            <Stack flex="1" gap="calc(1rem - 12px)" pt="calc(1rem - 12px)" align="start">
                {children}
            </Stack>
        </Group>
    );
};

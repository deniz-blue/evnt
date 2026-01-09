import { Anchor, Tooltip } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";
import type { PropsWithChildren } from "react";

export const ExternalLink = ({
    children,
    href,
}: PropsWithChildren<{
    href: string;
}>) => {
    return (
        <Tooltip label={href}>
            <Anchor inline inherit href={href} fz="sm" c="dimmed" target="_blank" rel="noopener noreferrer">
                {children ?? new URL(href).hostname} <IconExternalLink size="0.8em" />
            </Anchor>
        </Tooltip>
    );
};

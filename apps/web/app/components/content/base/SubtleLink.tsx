import { Anchor } from "@mantine/core";
import type { PropsWithChildren } from "react";
import { Link, type To } from "react-router";

export const SubtleLink = ({
    children,
    to,
    if: condition,
}: PropsWithChildren<{
    to: To;
    if: boolean;
}>) => {
    if (!condition) return children as React.ReactElement;

    return (
        <Anchor
            component={Link}
            to={to}
            c="unset"
            inherit
        >
            {children}
        </Anchor>
    )
};

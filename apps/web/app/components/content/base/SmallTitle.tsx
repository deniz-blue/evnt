import { Text } from "@mantine/core";
import type { PropsWithChildren } from "react";

export const SmallTitle = ({
    children,
    padLeft,
}: PropsWithChildren<{
    padLeft?: boolean;
}>) => {
    return (
        <Text fz="xs" fw="bold" c="dimmed" tt="uppercase" pl={padLeft ? 28 : 0}>
            {children}
        </Text>
    );
};

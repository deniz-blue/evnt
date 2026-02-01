import { Center, Loader, Stack } from "@mantine/core";
import type { PropsWithChildren } from "react";

export const CenteredLoader = ({
	children,
}: PropsWithChildren) => {
    return (
        <Center w="100%" h="100%">
            <Stack align="center" justify="center" style={{ height: "100%" }}>
				<Loader />
				{children}
			</Stack>
        </Center>
    );
};
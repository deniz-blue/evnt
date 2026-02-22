import { Center, Loader, Stack } from "@mantine/core";
import type { PropsWithChildren } from "react";

export const CenteredLoader = ({
	children,
	loaderColor,
}: PropsWithChildren<{
	loaderColor?: string;
}>) => {
	return (
		<Center w="100%" h="100%">
			<Stack align="center" justify="center" style={{ height: "100%" }}>
				<Loader color={loaderColor} />
				{children}
			</Stack>
		</Center>
	);
};
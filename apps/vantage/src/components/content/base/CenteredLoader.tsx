import { Center, Loader, Stack } from "@mantine/core";
import type { PropsWithChildren } from "react";

export const CenteredLoader = ({
	children,
	loaderColor,
	loaderProps,
}: PropsWithChildren<{
	loaderColor?: string;
	loaderProps?: React.ComponentProps<typeof Loader>;
}>) => {
	return (
		<Center w="100%" h="100%">
			<Stack align="center" justify="center" style={{ height: "100%" }}>
				<Loader color={loaderColor} {...loaderProps} />
				{children}
			</Stack>
		</Center>
	);
};
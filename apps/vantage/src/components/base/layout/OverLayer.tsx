import { Box, type BoxProps } from "@mantine/core";
import type { PropsWithChildren } from "react";

export const OverLayer = ({
	children,
	...props
}: PropsWithChildren<BoxProps>) => {
	return (
		<Box
			pos="absolute"
			inset={0}
			style={{ zIndex: 0 }}
			w="100%"
			h="100%"
			{...props}
		>
			{children}
		</Box>
	);
};

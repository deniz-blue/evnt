import { Text, type TextProps } from "@mantine/core";
import type { PropsWithChildren } from "react";

export const SmallTitle = ({
	children,
	padLeft,
	...props
}: PropsWithChildren<{
	padLeft?: boolean;
} & React.HTMLAttributes<HTMLParagraphElement>>) => {
	return (
		<Text
			fz="xs"
			fw="bold"
			c="dimmed"
			tt="uppercase"
			pl={padLeft ? 28 : 0}
			role="heading"
			{...props}
		>
			{children}
		</Text>
	);
};

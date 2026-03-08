import { Anchor } from "@mantine/core";
import { Link, type LinkComponent } from "@tanstack/react-router";
import type { PropsWithChildren } from "react";

export const SubtleLink = <Props extends LinkComponent<"a">>({
	children,
	href,
	newTab = false,
}: PropsWithChildren<{
	href?: string;
	newTab?: boolean;
} & Props>) => {
	// TODO: tanstack

	if (!href) return children as React.ReactElement;

	return (
		<Anchor
			component={Link}
			href={href}
			c="unset"
			inherit
			target={newTab ? "_blank" : undefined}
		>
			{children}
		</Anchor>
	)
};

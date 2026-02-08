import { Anchor } from "@mantine/core";
import type { PropsWithChildren } from "react";
import { Link, type To } from "react-router";

export const SubtleLink = ({
	children,
	to,
	newTab = false,
}: PropsWithChildren<{
	to?: To;
	newTab?: boolean;
}>) => {
	if (!to) return children as React.ReactElement;

	return (
		<Anchor
			component={Link}
			to={to}
			c="unset"
			inherit
			target={newTab ? "_blank" : undefined}
		>
			{children}
		</Anchor>
	)
};

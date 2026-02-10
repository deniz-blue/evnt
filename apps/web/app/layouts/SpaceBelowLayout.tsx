import { Box, Space } from "@mantine/core";
import { Outlet } from "react-router";

export default function SpaceBelowLayout() {
	return (
		<Box p="xs">
			<Outlet />
			<Space h="30rem" />
		</Box>
	)
}

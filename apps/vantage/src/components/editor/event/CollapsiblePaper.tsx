import { Accordion, ActionIcon, Box, CloseButton, Collapse, Group, Paper, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { PropsWithChildren } from "react";

export const CollapsiblePaper = ({
	children,
	onDelete,
	icon,
	title,
}: PropsWithChildren<{
	onDelete?: () => void;
	icon?: React.ReactNode;
	title?: React.ReactNode;
}>) => {
	const [collapsed, { toggle }] = useDisclosure(false);

	return (
		<Paper withBorder p="xs">
			<Stack gap={0}>
				<Group justify="space-between" gap={4} align="start" wrap="nowrap">
					<Group gap={4} align="start" c="dimmed" wrap="nowrap">
						<ActionIcon onClick={toggle} size="md" variant="subtle" color="gray">
							<Accordion.Chevron style={{
								transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)",
								transition: "transform 150ms ease",
							}} />
						</ActionIcon>
						{icon}
						<Text inherit span fw="bold">
							{title}
						</Text>
					</Group>
					<CloseButton
						onClick={onDelete}
					/>
				</Group>

				<Collapse expanded={!collapsed}>
					<Stack p="xs">
						{children}
					</Stack>
				</Collapse>
			</Stack>
		</Paper>
	);
};

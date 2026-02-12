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
			<Stack>
				<Group justify="space-between" align="start">
					<Group gap={4} align="start" c="dimmed">
						<ActionIcon onClick={toggle} size={24} variant="subtle" color="gray">
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

				<Collapse in={!collapsed}>
					<Stack p="xs">
						{children}
					</Stack>
				</Collapse>
			</Stack>
		</Paper>
	);
};

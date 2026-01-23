import { ActionIcon, AppShell, Box, Button, Group, Loader, NavLink, type ButtonProps } from "@mantine/core";
import { Link, Outlet } from "react-router";
import { LinkOpenHandler } from "../components/app/handlers/LinkOpenHandler";
import { EventDetailsOverlay } from "../components/app/overlay/event/EventDetailsOverlay";
import { IconSettings } from "@tabler/icons-react";
import { SettingsOverlay, useSettingsOverlay } from "../components/app/overlay/settings/SettingsOverlay";
import { useHotkeys } from "@mantine/hooks";
import { useTasksStore } from "../stores/useTasksStore";

export default function MainLayout() {
	const { toggle: toggleSettings } = useSettingsOverlay();

	useHotkeys([
		["mod + O", () => toggleSettings("")],
		["mod + ,", () => toggleSettings("")],
	], []);
	useHotkeys([["O", () => toggleSettings("")]]);

	const navbtnprops: ButtonProps = {
		variant: "subtle",
		color: "gray",
		size: "compact-md",
	} as const;

	return (
		<AppShell
			padding="xs"
			header={{
				height: 60,
			}}
		>
			<AppShell.Header>
				<Group p="xs" align="center" h="100%" w="100%" justify="space-between">
					<Group>
						<Button
							component={Link}
							to="/"
							{...navbtnprops}
						>
							Home
						</Button>
						<Button
							component={Link}
							to="/list"
							{...navbtnprops}
						>
							List
						</Button>
						<DatabaseStateView />
					</Group>
					<Group>
						<ActionIcon size="input-md" onClick={() => toggleSettings("")}>
							<IconSettings />
						</ActionIcon>
					</Group>
				</Group>
			</AppShell.Header>
			<AppShell.Main>
				<Outlet />
				<EventDetailsOverlay />
				<SettingsOverlay />
			</AppShell.Main>

			<LinkOpenHandler />
		</AppShell>
	);
};

export const DatabaseStateView = () => {
	const tasks = useTasksStore((state) => state.tasks);

	return (
		<Box>
			{!!tasks.length && <Loader size="xs" />}
			{!!tasks.length && ` Running ${tasks.length} task(s)`}
		</Box>
	);
};

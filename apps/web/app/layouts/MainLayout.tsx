import { ActionIcon, AppShell, Box, Button, Group, Loader, Space, type ButtonProps } from "@mantine/core";
import { isRouteErrorResponse, Link, Outlet, useRouteError } from "react-router";
import { LinkOpenHandler } from "../components/app/handlers/LinkOpenHandler";
import { EventDetailsOverlay } from "../components/app/overlay/event/EventDetailsOverlay";
import { IconSettings } from "@tabler/icons-react";
import { SettingsOverlay, useSettingsOverlay } from "../components/app/overlay/settings/SettingsOverlay";
import { useHotkeys } from "@mantine/hooks";
import { useTasksStore } from "../stores/useTasksStore";
import { Initializers } from "../components/app/handlers/Initializers";
import { ViewIndexOverlay } from "../components/app/overlay/index/ViewIndexOverlay";
import { useIsFetching } from "@tanstack/react-query";

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
				height: "calc(60px + env(safe-area-inset-top, 0px))",
			}}
			pb="env(safe-area-inset-bottom, 0px)"
		>
			<AppShell.Header pt="env(safe-area-inset-top, 0px)">
				<Group gap={0} p="xs" align="center" h="100%" w="100%" justify="space-between">
					<Group gap="xs">
						<img src="/icon.svg" alt="@evnt Viewer Logo" width={32} height={32} />
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
				<ViewIndexOverlay />
				<EventDetailsOverlay />
				<SettingsOverlay />
				<Space h="30rem" />
			</AppShell.Main>

			<LinkOpenHandler />
			<Initializers />
		</AppShell>
	);
};

export const DatabaseStateView = () => {
	const isFetching = useIsFetching();
	const tasks = useTasksStore((state) => state.tasks);

	return (
		<Box>
			{(!!tasks.length || !!isFetching) && <Loader size="xs" />}
			{(!!tasks.length || !!isFetching) && ` Running ${tasks.length + (isFetching ? 1 : 0)} task(s)`}
		</Box>
	);
};

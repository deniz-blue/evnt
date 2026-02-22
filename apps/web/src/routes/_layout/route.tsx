import { ActionIcon, Anchor, AppShell, Button, Code, Container, Flex, Group, Loader, Menu, Space, Text, Title, type ButtonProps } from "@mantine/core";
import { createFileRoute, Link, Outlet, useMatches, type ErrorComponentProps } from "@tanstack/react-router"
import { IconBraces, IconEdit, IconLink, IconPlus, IconSettings } from "@tabler/icons-react";
import z from "zod";
import { zodValidator } from "@tanstack/zod-adapter";
import { SettingsDrawer } from "../../components/app/overlay/settings/SettingsDrawer";
import { useSettingsOverlay } from "../../hooks/app/search-param-modals";
import { useHotkeys } from "@mantine/hooks";
import { EventSourceSchema } from "../../db/models/event-source";
import { useIsFetching } from "@tanstack/react-query";
import { useTasksStore } from "../../stores/useTasksStore";
import { Fragment } from "react/jsx-runtime";
import { ViewIndexOverlay } from "../../components/app/overlay/index/ViewIndexOverlay";
import { EventDetailsOverlay } from "../../components/app/overlay/event/EventDetailsOverlay";
import { modals } from "@mantine/modals";

const SearchParamsSchema = z.object({
	settings: z.string().optional(),
	event: EventSourceSchema.optional(),
	"view-index": z.string().optional(),
});

export const Route = createFileRoute("/_layout")({
	component: LayoutPage,
	validateSearch: zodValidator(SearchParamsSchema),
	errorComponent: ErrorBoundary,
})

function LayoutPage() {
	const spaceless = useMatches({
		select: (matches) => matches.some((match) => match.staticData?.spaceless),
	});

	const hasEventForm = useMatches({
		select: (matches) => matches.some((match) => match.staticData?.hasEventForm),
	});

	const navbtnprops: ButtonProps = {
		variant: "subtle",
		color: "gray",
		size: "compact-md",
	} as const;

	return (
		<AppShell
			header={{
				height: "calc(60px + env(safe-area-inset-top, 0px))",
			}}
			mb="env(safe-area-inset-bottom, 0px)"
			padding={spaceless ? 0 : "xs"}
		>
			<AppShell.Header pt="env(safe-area-inset-top, 0px)">
				<Group gap={0} p="xs" align="center" h="100%" w="100%" justify="space-between">
					<Group gap={4}>
						<Logo />
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
						<Button
							component={Link}
							to="/calendar"
							{...navbtnprops}
						>
							Cal
						</Button>
					</Group>
					<Group gap={4}>
						<Menu>
							{!hasEventForm && (
								<Menu.Target>
									<ActionIcon
										size="input-md"
										color="green"
									>
										<IconPlus />
									</ActionIcon>
								</Menu.Target>
							)}
							<Menu.Dropdown>
								<Menu.Item
									leftSection={<IconEdit />}
									renderRoot={(props) => (
										<Link
											to="/new"
											{...props}
										/>
									)}
								>
									Create New
								</Menu.Item>
								<Menu.Item
									leftSection={<IconLink />}
									onClick={() => modals.openContextModal({
										modal: "ImportURLModal",
										innerProps: {},
										size: "xl",
									})}
								>
									Add From URL
								</Menu.Item>
								<Menu.Item
									leftSection={<IconBraces />}
									onClick={() => modals.openContextModal({
										modal: "ImportJSONModal",
										innerProps: {},
										size: "xl",
									})}
								>
									Add From JSON content
								</Menu.Item>
							</Menu.Dropdown>
						</Menu>
						<ActionIcon
							size="input-md"
							renderRoot={(props) => (
								<Link
									to="."
									search={prev => ({
										...prev,
										settings: prev.settings !== undefined ? undefined : "",
									})}
									{...props}
								/>
							)}
						>
							<IconSettings />
						</ActionIcon>
					</Group>
				</Group>
			</AppShell.Header>
			<AppShell.Main>
				<Outlet />
				<Overlays />
				<Shortcuts />
				{!spaceless && <Space h="30vh" />}
			</AppShell.Main>
		</AppShell>
	)
}

const Overlays = () => {
	const { toggle: toggleSettings, useValue } = useSettingsOverlay();
	const settingsIsOpen = useValue();

	return (
		<Fragment>
			<SettingsDrawer
				isOpen={settingsIsOpen !== undefined}
				close={toggleSettings}
			/>
			<ViewIndexOverlay />
			<EventDetailsOverlay />
		</Fragment>
	);
};

const Shortcuts = () => {
	const { toggle: toggleSettings } = useSettingsOverlay();

	useHotkeys([
		["mod + O", () => toggleSettings("")],
		["mod + ,", () => toggleSettings("")],
	], []);
	useHotkeys([["O", () => toggleSettings("")]]);

	return null;
};

const Logo = () => {
	const fetchingAmount = useIsFetching();
	const tasks = useTasksStore((state) => state.tasks);

	const loading = !!fetchingAmount || !!tasks.length;

	return (
		<Flex align="center" justify="center">
			<img src="/icon.svg" alt="@evnt Viewer Logo" width={32} height={32} style={{
				scale: loading ? "0.7" : "1",
				transition: "0.2s",
			}} />
			<Loader
				pos="absolute"
				width="100%"
				height="100%"
				style={{
					opacity: loading ? 1 : 0,
					transition: "0.2s",
				}}
			/>
		</Flex>
	);
};

export function ErrorBoundary({ error, reset, info }: ErrorComponentProps) {
	let title = "";
	let codeContent = "";

	if (error instanceof Error) {
		title = error.message;
		codeContent = error.stack || "";
	} else {
		title = "Unknown Error";
		codeContent = String(error);
	}

	if (info?.componentStack) codeContent += `\n\nComponent Stack:\n${info.componentStack}`;

	return (
		<Container my="xl" size="sm" py="xl">
			<Title>
				Fuck
			</Title>

			<Text>
				The Application crashed! Please report the following error to the developers:
			</Text>

			<Text>
				{title}
			</Text>

			<Code block>
				{codeContent}
			</Code>

			<Anchor component="button" onClick={() => reset()} mt="md" display="block">
				Reset
			</Anchor>
		</Container>
	);
};

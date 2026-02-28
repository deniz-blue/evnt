import { ActionIcon, Anchor, AppShell, Button, Code, Container, Flex, Group, Loader, Space, Text, Title, type ButtonProps } from "@mantine/core";
import { createFileRoute, Link, Outlet, useMatches, useNavigate, type ErrorComponentProps } from "@tanstack/react-router"
import { IconCalendar, IconHome, IconList, IconSearch, IconSettings } from "@tabler/icons-react";
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
import { AddEventMenu } from "../../components/app/AddEventMenu";
import { VantageSpotlight } from "../../components/app/overlay/spotlight/VantageSpotlight";
import { spotlight } from "@mantine/spotlight";
import { useProvideAction } from "../../components/app/overlay/spotlight/useAction";

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
	const navigate = useNavigate();

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

	useProvideAction({
		label: "Go to Home",
		category: "Navigation",
		icon: <IconHome />,
		execute: () => navigate({ to: "/" }),
	});

	useProvideAction({
		label: "Go to List view",
		category: "Navigation",
		icon: <IconList />,
		execute: () => navigate({ to: "/list" }),
	});

	useProvideAction({
		label: "Go to Calendar view",
		category: "Navigation",
		icon: <IconCalendar />,
		execute: () => navigate({ to: "/calendar" }),
	});

	useProvideAction({
		label: "Toggle Settings",
		category: "Navigation",
		icon: <IconSettings />,
		execute: () => navigate({
			to: ".",
			search: prev => ({
				...prev,
				settings: prev.settings !== undefined ? undefined : "",
			}),
		}),
	});

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
						<ActionIcon
							color="gray"
							size="input-md"
							onClick={spotlight.toggle}
						>
							<IconSearch />
						</ActionIcon>
						{!hasEventForm && (
							<AddEventMenu />
						)}
						<ActionIcon
							size="input-md"
							color="gray"
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
				<VantageSpotlight />
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

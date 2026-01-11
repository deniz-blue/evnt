import { ActionIcon, AppShell, Box, Button, Group, Loader } from "@mantine/core";
import { useEffect } from "react";
import { Link, Outlet } from "react-router";
import { useEventStore } from "../stores/useEventStore";
import { LinkOpenHandler } from "../components/app/handlers/LinkOpenHandler";
import { EventDetailsOverlay } from "../components/app/overlay/event/EventDetailsOverlay";
import { IconSettings } from "@tabler/icons-react";
import { SettingsOverlay, useSettingsOverlay } from "../components/app/overlay/settings/SettingsOverlay";

export default function MainLayout() {
    const { open: openSettings } = useSettingsOverlay();

    useEffect(() => {
        useEventStore.getState().getDB();
        return () => void useEventStore.getState().dbUninitialize();
    }, [useEventStore]);

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
                        <Button component={Link} to="/">
                            Home
                        </Button>
                        <Button component={Link} to="/list">
                            List
                        </Button>
                        <Button disabled>
                            Calendar
                        </Button>
                        <Button disabled>
                            Map
                        </Button>
                        <DatabaseStateView />
                    </Group>
                    <Group>
                        <ActionIcon onClick={() => openSettings("")}>
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
    const tasks = useEventStore((state) => state.tasks);

    return (
        <Box>
            {!!tasks.length && <Loader size="xs" />}
            {!!tasks.length && ` Running ${tasks.length} task(s)`}
        </Box>
    );
};

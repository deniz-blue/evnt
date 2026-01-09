import { AppShell, Box, Button, Group, Loader } from "@mantine/core";
import { useEffect } from "react";
import { Link, Outlet } from "react-router";
import { useEventStore } from "../stores/useEventStore";
import { LinkOpenHandler } from "../components/app/handlers/LinkOpenHandler";
import { EventDetailsOverlay } from "../components/app/overlay/event/EventDetailsOverlay";

export default function MainLayout() {
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
                <Group p="xs" align="center" h="100%" w="100%">
                    <Button component={Link} to="/">
                        Home
                    </Button>
                    <Button component={Link} to="/list">
                        List
                    </Button>
                    <DatabaseStateView />
                </Group>
            </AppShell.Header>
            <AppShell.Main>
                <Outlet />
                <EventDetailsOverlay />
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

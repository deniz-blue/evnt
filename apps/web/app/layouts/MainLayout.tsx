import { AppShell, Box, Button, Group, Loader } from "@mantine/core";
import { useEffect } from "react";
import { Link, Outlet } from "react-router";
import { useEventStore } from "../lib/stores/useEventStore";
import { useEventRedirectorStore } from "../hooks/useEventRedirector";
import { LinkOpenHandler } from "../components/app/handlers/LinkOpenHandler";

export default function MainLayout() {
    useEffect(() => {
        useEventStore.getState().dbInitialize();
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
            </AppShell.Main>

            <LinkOpenHandler />
        </AppShell>
    );
};

export const DatabaseStateView = () => {
    const idle = useEventStore((state) => state.dbIdle);

    return (
        <Box>
            {!idle && <Loader size="xs" />}
        </Box>
    );
};

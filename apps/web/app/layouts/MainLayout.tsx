import { AppShell, Box, Button, Group, Loader } from "@mantine/core";
import { useEffect } from "react";
import { Link, Outlet } from "react-router";
import { useEventDatabase } from "../lib/stores/useEventStore";
import { useEventRedirectorStore } from "../hooks/useEventRedirector";

export default function MainLayout() {
    useEffect(() => {
        useEventDatabase.getState().init();
        useEventRedirectorStore.getState().initialize();
    }, []);

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
        </AppShell>
    );
};

export const DatabaseStateView = () => {
    const idle = useEventDatabase((state) => state.idle);

    return (
        <Box>
            {!idle && <Loader size="xs" />}
        </Box>
    );
};

import { AppShell, Button, Group } from "@mantine/core";
import { useEffect } from "react";
import { Link, Outlet } from "react-router";
import { useEventStore } from "../lib/database/useEventStore";

export default function MainLayout() {
    useEffect(() => {
        useEventStore.getState().initialize();
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
                </Group>
            </AppShell.Header>
            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
};

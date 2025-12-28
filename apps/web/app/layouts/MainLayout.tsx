import { AppShell } from "@mantine/core";
import { useEffect } from "react";
import { Outlet } from "react-router";
import { useEventStore } from "../lib/database/useEventStore";

export default function MainLayout() {
    useEffect(() => {
        useEventStore.getState().initialize();
    }, []);

    return (
        <AppShell>
            <AppShell.Header>
                meow
            </AppShell.Header>
            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
};

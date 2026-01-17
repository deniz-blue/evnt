import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "react-router";
import { createTheme, MantineProvider, type ActionIconProps, type ButtonProps, type TooltipProps } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DataDB } from "./db/data-db";
import { eventDataQueryKey } from "./db/useEventDataQuery";

import type { Route } from "./+types/root";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@denizblue/mantine-zod-form/style.css";
import { useLayersStore } from "./db/useLayersStore";
import { useWindowEvent } from "@mantine/hooks";
import { useHomeStore } from "./stores/useHomeStore";
import.meta.glob("./styles/**/*.css", { eager: true });

export const meta: Route.MetaFunction = () => [
	{ title: "@evnt Viewer" },
];

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				<MantineProvider
					forceColorScheme="dark"
					theme={createTheme({
						components: {
							ActionIcon: {
								defaultProps: {
									variant: "light",
								} as ActionIconProps,
							},
							Button: {
								defaultProps: {
									variant: "light",
								} as ButtonProps,
							},
							Tooltip: {
								defaultProps: {
									withArrow: true,
									arrowOffset: 4,
									arrowSize: 6,
									color: "gray",
									opacity: 0.9,
								} as TooltipProps,
							},
						},
					})}
				>
					<Notifications />
					<ModalsProvider>
						{children}
					</ModalsProvider>
				</MantineProvider>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	const [queryClient] = useState(() => new QueryClient());

	useEffect(() => {
		return DataDB.onUpdate((key) => {
			queryClient.invalidateQueries({ queryKey: [eventDataQueryKey(key), "event-data-keys"] });
			useLayersStore.persist.rehydrate();
		});
	}, [queryClient]);

	useWindowEvent("storage", (event) => {
		if (event.key === useLayersStore.persist.getOptions().name) useLayersStore.persist.rehydrate();
		if (event.key === useHomeStore.persist.getOptions().name) useHomeStore.persist.rehydrate();
	});

	return (
		<QueryClientProvider client={queryClient}>
			<Outlet />
		</QueryClientProvider>
	);
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error";
		details =
			error.status === 404
				? "The requested page could not be found."
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main style={{ paddingTop: "4rem", padding: "1rem", maxWidth: "1200px", margin: "0 auto" }}>
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre style={{ width: "100%", padding: "1rem", overflowX: "auto" }}>
					<code>{stack}</code>
				</pre>
			)}
		</main>
	);
}

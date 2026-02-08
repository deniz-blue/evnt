import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "react-router";
import { Box, createTheme, MantineProvider, type ActionIconProps, type ButtonProps, type TooltipProps } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CenteredLoader } from "./components/content/base/CenteredLoader";
import type { Route } from "./+types/root";

import { contextModals } from "./components/app/modals/modals";
import "./dayjslocales";
import.meta.glob("./styles/**/*.css", { eager: true });
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";

export const meta: Route.MetaFunction = () => [
	{ title: "Vantage Events Viewer" },
];

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
				<link rel="manifest" href="/manifest.webmanifest" />
				<link rel="icon" href="/icon.svg" />
				<link rel="icon" href="/icon.png" />
				<Meta />
				<Links />
			</head>
			<body style={{ backgroundColor: "#242424" }}>
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
					<ModalsProvider modals={contextModals}>
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

export function HydrateFallback() {
	return (
		<Box h="90vh" pt="xl">
			<CenteredLoader>
				Loading...
			</CenteredLoader>
		</Box>
	);
}

import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "react-router";
import { ActionIcon, createTheme, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import type { Route } from "./+types/root";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@denizblue/mantine-zod-form/style.css";

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
								},
							},
							Button: {
								defaultProps: {
									variant: "light",
								},
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
	return <Outlet />;
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

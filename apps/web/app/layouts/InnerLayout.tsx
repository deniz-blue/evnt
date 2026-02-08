import { Code, Container, ScrollArea, Text, Title } from "@mantine/core";
import { isRouteErrorResponse, Outlet, useRouteError } from "react-router";

export default function InnerLayout() {
	return (
		<Outlet />
	);
};

export function ErrorBoundary() {
	const error = useRouteError();

	let title = "";
	let codeContent = "";

	if (isRouteErrorResponse(error)) {
		title = `${error.status} ${error.statusText}`;
		codeContent = JSON.stringify(error.data, null, 2);
	} else if (error instanceof Error) {
		title = error.message;
		codeContent = error.stack || "";
	} else {
		title = "Unknown Error";
		codeContent = String(error);
	}

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
		</Container>
	);
}


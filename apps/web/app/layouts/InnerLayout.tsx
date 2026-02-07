import { isRouteErrorResponse, Outlet, useRouteError } from "react-router";

export default function InnerLayout() {
	return (
		<Outlet />
	);
};

export function ErrorBoundary() {
	const error = useRouteError();

	if (isRouteErrorResponse(error)) {
		return (
			<div>
				<h1>
					{error.status} {error.statusText}
				</h1>
				<p>{error.data} meow</p>
			</div>
		);
	} else if (error instanceof Error) {
		return (
			<div>
				<h1>Error :c</h1>
				<p>{error.message}</p>
				<p>The stack trace is:</p>
				<pre>{error.stack}</pre>
			</div>
		);
	} else {
		return <h1>Unknown Error mrow</h1>;
	}
}


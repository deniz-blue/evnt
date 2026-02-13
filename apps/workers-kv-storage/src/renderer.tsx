import { Context } from "hono";
import { SignCallbackPageProps } from "./pages/sign-callback";

export const renderSignCallbackPage = (c: Context, props: SignCallbackPageProps) => {
	return c.html(
		<html>
			<head>
				<meta charSet="utf-8" />
				<meta content="width=device-width, initial-scale=1" name="viewport" />
				{import.meta.env.PROD ? (
					<script type="module" src="/static/client.js" />
				) : (
					<script type="module" src="/src/client.tsx" />
				)}
			</head>
			<body>
				<div id="root" data-props={JSON.stringify(props)}></div>
			</body>
		</html>
	);
};

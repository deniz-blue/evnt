import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
	layout("./layouts/MainLayout.tsx", [
		index("routes/home.tsx"),
		route("list", "routes/list.tsx"),
		route("oauth/callback", "routes/oauth-callback.tsx"),
		route("test", "routes/test.tsx"),
		route("new", "routes/new.tsx"),
	]),
] satisfies RouteConfig;

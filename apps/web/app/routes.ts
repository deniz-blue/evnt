import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
	layout("./layouts/LogicLayout.tsx", [
		layout("./layouts/MainLayout.tsx", [
			layout("./layouts/InnerLayout.tsx", [
				index("routes/home.tsx"),
				route("list", "routes/list.tsx"),
				route("oauth/callback", "routes/oauth-callback.tsx"),
				route("test", "routes/test.tsx"),
				route("new", "routes/new.tsx"),
				route("edit", "routes/edit.tsx"),
			]),
		]),

		route("form", "routes/form.tsx"),
		route("embed", "routes/embed.tsx"),
	]),
] satisfies RouteConfig;

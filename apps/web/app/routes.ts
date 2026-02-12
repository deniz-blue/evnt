import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
	layout("./layouts/LogicLayout.tsx", [
		layout("./layouts/MainLayout.tsx", [
			layout("./layouts/InnerLayout.tsx", [
				layout("./layouts/SpaceBelowLayout.tsx", [
					index("routes/home.tsx"),
					route("list", "routes/list.tsx"),
					route("event", "routes/event.tsx"),
					route("test", "routes/test.tsx"),
					route("new", "routes/new.tsx"),
					route("edit", "routes/edit.tsx"),
				]),
				route("calendar", "routes/calendar.tsx"),
			]),
		]),

		route("oauth/callback", "routes/oauth-callback.tsx"),
		route("form", "routes/form.tsx"),
		route("embed", "routes/embed.tsx"),
	]),
] satisfies RouteConfig;

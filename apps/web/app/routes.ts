import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout("./layouts/MainLayout.tsx", [
        index("routes/home.tsx"),
        route("list", "routes/list.tsx"),
		route("oauth/callback", "routes/oauth-callback.tsx"),
    ]),
] satisfies RouteConfig;

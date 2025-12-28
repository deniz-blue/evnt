import { type RouteConfig, index, layout } from "@react-router/dev/routes";

export default [
    layout("./layouts/MainLayout.tsx", [
        index("routes/home.tsx"),
    ]),
] satisfies RouteConfig;

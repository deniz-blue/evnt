import { openAPIRouteHandler } from "hono-openapi";
import { app } from "../app";

app.get("/openapi.json", openAPIRouteHandler(app, {
    documentation: {
        info: {
            title: "Events Data Server API",
            version: "0.0.1",
        },
    },
}));

app.get("/docs", (c) => {
    // Redirect to https://rest.wiki/?<link>/openapi.json
    const root = new URL(c.req.url).origin;
    return c.redirect(`https://rest.wiki/?${root}/openapi.json`);
});

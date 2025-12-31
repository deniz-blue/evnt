import { openAPIRouteHandler } from "hono-openapi";
import { app } from "../app";

// import * as Schemas from "@evnt/format";
// const workaround = Object.fromEntries(Object.entries(
//     Schemas
// ).map(([key, schema]) => {
//     return [key, schema.toJSONSchema({
//         target: "openapi-3.0",
//         reused: "ref",
//     })];
// }));

app.get("/openapi.json", openAPIRouteHandler(app, {
    documentation: {
        info: {
            title: "Events Data Server API",
            version: "0.0.1",
        },
        // components: {
        //     schemas: workaround as any,
        // },
    },
}));

app.get("/docs", (c) => {
    // Redirect to https://rest.wiki/?<link>/openapi.json
    const root = new URL(c.req.url).origin;
    return c.redirect(`https://rest.wiki/?${root}/openapi.json`);
});

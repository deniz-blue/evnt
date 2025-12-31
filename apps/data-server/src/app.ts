import { Hono } from "hono";
import { cors } from 'hono/cors';
import { etag } from "hono/etag";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";

export const app = new Hono();
export type AppType = typeof app;

app.use("*",
    logger(),
    cors(),
    etag(),
    prettyJSON(),
);

app.get("/", (c) => {
    return c.text("Meow")
})

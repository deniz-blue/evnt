import { Hono } from "hono";
import { cors } from 'hono/cors';
import { etag } from "hono/etag";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { events } from "./endpoints/events";
import { eventPatch } from "./endpoints/event-patch";
import { auth } from "./endpoints/auth";

export const app = new Hono()
    .use("*",
        logger(),
        cors(),
        etag(),
        prettyJSON(),
    ).get("/", (c) => {
        return c.text("Meow")
    })
    .route("/events", events)
    .route("/events", eventPatch)
    .route("/auth", auth)

export type AppType = typeof app;

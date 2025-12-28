import { Hono } from "hono";
import { describeResponse, describeRoute, openAPIRouteHandler, resolver, validator as zValidator } from "hono-openapi";
import { cors } from 'hono/cors';
import { etag } from "hono/etag";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { z } from "zod";
import { EventDataSchema } from "@repo/model";

const app = new Hono();
app.use("*",
    logger(),
    cors(),
    etag(),
    prettyJSON(),
);

app.get("/", (c) => {
    return c.text("Meow")
})

const ErrorResponseSchema = z.object({
    error: z.string(),
});

const Success = <T>(schema: T) => ({
    description: "Success",
    content: {
        "application/json": {
            vSchema: schema,
        },
    },
});

const ErrorResponse = {
    description: "Error",
    content: {
        "application/json": {
            vSchema: ErrorResponseSchema,
        },
    },
};

// List
app.get(
    "/events",
    describeResponse(
        (c) => {
            return c.json({ events: [] }, 200);
        },
        {
            200: Success(z.object({
                events: EventDataSchema.array(),
            })),
            400: ErrorResponse,
        },
    ),
);

// Get
app.get("/events/:id", (c) => {
    const { id } = c.req.param();
    return c.json({ eventId: id });
});

// Create
app.post("/events", (c) => {
    const eventData = c.req.json();
    return c.json({ received: eventData });
});

// Update
app.patch("/events/:id", (c) => {
    const { id } = c.req.param();
    const eventData = c.req.json();
    return c.json({ updatedEventId: id, received: eventData });
});

// Delete
app.delete("/events/:id", (c) => {
    const { id } = c.req.param();
    return c.json({ deletedEventId: id });
});

app.get("/openapi.json", openAPIRouteHandler(app, {
    documentation: {
        info: {
            title: "Events Data Server API",
            version: "0.0.1",
        },
    }
}));

app.get("/docs", (c) => {
    // Redirect to https://rest.wiki/<our domain>/openapi.json
    const domain = c.req.header("host");
    if (!domain) return c.text("Host header is missing", 400);
    return c.redirect(`https://rest.wiki/${domain}/openapi.json`);
});

export default app;

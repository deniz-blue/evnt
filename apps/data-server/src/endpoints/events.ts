import { EventDataSchema } from "@evnt/schema";
import { Hono } from "hono";
import { validator } from "hono-openapi";
import { db } from "../database/db";

export const events = new Hono()
    .post(
        "/",
        validator("json", EventDataSchema),
        async (c) => {
            const data = c.req.valid("json");
            const id = await db.createEvent({ data });
            return c.json(id);
        },
    )
    .get(
        "/:id",
        async (c) => {
            const { id } = c.req.param();
            const event = await db.getEvent(id);
            if (!event) {
                return c.json({ error: "Event not found", code: "NOT_FOUND" }, 404);
            }
            return c.json({ event: event.data });
        },
    )
    .delete(
        "/:id",
        async (c) => {
            const { id } = c.req.param();
            await db.deleteEvent(id);
            return c.json({});
        },
    )

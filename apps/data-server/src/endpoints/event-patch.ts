import { Hono } from "hono";
import { db } from "../database/db";

export const eventPatch = new Hono()
    .get(
        "/:eventId/patches",
        async (c) => {
            const { eventId } = c.req.param();
            const patches = await db.getEventPatches(eventId);
            return c.json(patches);
        }
    )

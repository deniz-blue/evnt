import { describeRoute, validator } from "hono-openapi";
import { app } from "../app";
import { APINotFound, APISuccess, APIZodValidationError, zodValidationError } from "../result";
import { EventDataSchema } from "@evnt/schema";
import { db } from "../database/db";
import { applyOperations } from "json-patch-rfc";
import { JsonPatchSchema } from "@evnt/json-patch-schema";

// Update
app.patch(
    "/events/:id",
    validator("json", JsonPatchSchema),
    describeRoute({
        description: "Update an event by ID using JSON Patch (RFC 6902)",
        responses: {
            200: APISuccess(EventDataSchema),
            404: APINotFound(),
            400: APIZodValidationError(),
        },
    }),
    async (c) => {
        const id = c.req.param("id");
        const patches = c.req.valid("json");

        const existing = await db.getEvent(id);
        if (!existing) return c.json({ error: "Event not found", code: "NOT_FOUND" }, 404);

        const updated = applyOperations(existing.data, patches);
        const validated = EventDataSchema.safeParse(updated);

        if (!validated.success)
            return c.json(zodValidationError(validated.error), 400);

        await db.updateEventData(id, validated.data);

        return c.json(validated.data);
    },
);

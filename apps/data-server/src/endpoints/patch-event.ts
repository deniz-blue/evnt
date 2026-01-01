import { describeRoute, validator } from "hono-openapi";
import { app } from "../app";
import { APINotFound, APISuccess, APIZodValidationError, zodValidationError } from "../result";
import { EventDataSchema } from "@evnt/schema";
import z from "zod";
import { db } from "../database/db";
import { applyOperations } from "json-patch-rfc";

export const JsonPatchPathSchema = z.string().startsWith("/");

// JSON Patch Operation Schema (RFC 6902)
export const JsonPatchOpSchema = z.discriminatedUnion("op", [
    z.object({
        op: z.literal("add"),
        path: JsonPatchPathSchema,
        value: z.unknown(),
    }),
    z.object({
        op: z.literal("remove"),
        path: JsonPatchPathSchema,
    }),
    z.object({
        op: z.literal("replace"),
        path: JsonPatchPathSchema,
        value: z.unknown(),
    }),
    z.object({
        op: z.literal("move"),
        from: JsonPatchPathSchema,
        path: JsonPatchPathSchema,
    }),
    z.object({
        op: z.literal("copy"),
        from: JsonPatchPathSchema,
        path: JsonPatchPathSchema,
    }),
    z.object({
        op: z.literal("test"),
        path: JsonPatchPathSchema,
        value: z.unknown(),
    }),
]);

export const JsonPatchSchema = z.array(JsonPatchOpSchema);

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

        await db.setEventData(id, validated.data);

        return c.json(validated.data);
    },
);

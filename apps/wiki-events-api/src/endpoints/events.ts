import { EventDataSchema } from "@evnt/schema";
import { Hono } from "hono";
import { validator } from "hono-openapi";
import { db } from "../database/db";
import { JsonPatchSchema } from "@evnt/json-patch-schema";
import { applyOperations } from "json-patch-rfc";
import { Errors } from "../result";

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
				return c.json(Errors.NotFound(), 404);
			}
			return c.json({ event: event.data });
		},
	)
	.patch(
		"/:id",
		validator("json", JsonPatchSchema),
		async (c) => {
			const id = c.req.param("id");
			const patches = c.req.valid("json");

			const existing = await db.getEvent(id);
			if (!existing) return c.json(Errors.NotFound(), 404);

			const updated = applyOperations(existing.data, patches);
			const validated = EventDataSchema.safeParse(updated);

			if (!validated.success)
				return c.json(Errors.ZodValidation(validated.error), 400);

			await db.updateEventData(id, validated.data);

			return c.json(validated.data);
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

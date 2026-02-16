import { Hono } from "hono";
import { db } from "../database/db";

export const eventPatch = new Hono()
	.get(
		"/:id/patches",
		async (c) => {
			const { id } = c.req.param();
			const patches = await db.getEventPatches(id);
			return c.json(patches);
		}
	)

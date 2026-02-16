import { Hono } from "hono";
import { cors } from 'hono/cors';
import { etag } from "hono/etag";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { events } from "./endpoints/events";
import { eventPatch } from "./endpoints/event-patch";
import { auth } from "./endpoints/auth";

declare module "hono" {
	interface ContextVariableMap {
		passport: {
			github?: string;
			discord?: string;
		};
	}
}

export const app = new Hono()
	.use("*",
		logger(),
		cors({
			origin: "*",
			allowHeaders: [
				"Content-Type",
				"Authorization",
				"ETag",
			],
		}),
		etag(),
		prettyJSON(),
	)
	.get(
		"/",
		(c) => {
			return c.text("Meow")
		},
	)
	.use("*", (c, next) => {
		c.set("passport", {
			github: c.get("user-github")?.id?.toString(),
			discord: c.get("user-discord")?.id,
		});
		return next();
	})
	.route("/events", events)
	.route("/events", eventPatch)
	.route("/auth", auth)

export type AppType = typeof app;

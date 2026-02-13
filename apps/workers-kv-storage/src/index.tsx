import { Hono } from "hono";
import { renderSignCallbackPage } from "./renderer";
import { etag } from "hono/etag";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";
import { zValidator } from "@hono/zod-validator";
import { EventDataSchema, type EventData } from "@evnt/schema";
import { SignCallbackPage } from "./pages/sign-callback";
import z from "zod";
import * as ed from "@noble/ed25519";
import { sha512 } from "@noble/hashes/sha2.js";
ed.hashes.sha512 = sha512;

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use(prettyJSON());
app.use(cors());

app.get("/", (c) => {
	return renderSignCallbackPage(c, {
		message: "new-event",
		path: "/api/v0/events/new",
	});
});

type Permissions = {
	r: boolean;
	w: boolean;
};

type KVMetadata = {
	access: Record<string, Permissions>;
};

const search = z.object({
	curve: z.enum(["ed25519"]).default("ed25519"),
	pubkey: z.string(),
	signature: z.string(),
});

app.get(
	"/api/v0/events/:uuid/content",
	etag(),
	zValidator("query", search),
	async (c) => {
		const uuid = c.req.param("uuid");

		const { pubkey, signature } = c.req.valid("query");
		const valid = ed.verify(ed.etc.hexToBytes(signature), new TextEncoder().encode(`get-event:${uuid}`), ed.etc.hexToBytes(pubkey));
		if (!valid) {
			return c.json({ error: "Invalid signature" }, 400);
		};

		const {
			metadata,
			value: data,
		} = await c.env.KV.getWithMetadata<EventData, KVMetadata>(`events:${uuid}`, "json");

		if (!metadata) {
			return c.json({ error: "Event not found" }, 404);
		}

		const permissions = metadata.access[pubkey];
		if (!permissions || !permissions.r) {
			return c.json({ error: "Access denied" }, 403);
		}

		return c.json(data);
	},
);

app.get(
	"/api/v0/events/new",
	zValidator("query", search),
	async (c) => {
		// step 1. Verify signature
		const { pubkey, signature } = c.req.valid("query");
		const valid = ed.verify(ed.etc.hexToBytes(signature), new TextEncoder().encode("new-event"), ed.etc.hexToBytes(pubkey));
		if (!valid) {
			return c.json({ error: "Invalid signature" }, 400);
		};

		// step 2. Create new event skeleton
		const uuid = crypto.randomUUID();

		const data: EventData = {
			v: 0,
			name: {},
		};

		// step 3. Store event in KV with write access for pubkey
		const metadata: KVMetadata = {
			access: {
				[pubkey]: { r: true, w: true },
			},
		};

		await c.env.KV.put(`events:${uuid}`, JSON.stringify(data), {
			metadata,
		});

		// step 4. Redirect user to Vantage /form for editing with ?redirect-to set to /api/v0/events/:uuid/edit

		return c.redirect(`https://vantage.deniz.blue/form?${new URLSearchParams({
			"redirect-to": `${c.req.url.replace("/new", `/${uuid}/edit`)}`
		})}`);
	},
);

// Vantage redirects to /edit; this endpoint will render JSX
// so the browser can sign another request to /commit with the updated event data

app.get(
	"/api/v0/events/:uuid/edit",
	zValidator("query", z.object({
		data: z.string(),
	})),
	async (c) => {
		const uuid = c.req.param("uuid");
		return renderSignCallbackPage(c, {
			message: `commit-event:${uuid}`,
			path: `${c.req.url.replace("/edit", "/commit")}`,
		});
	},
);

app.get(
	"/api/v0/events/:uuid/commit",
	zValidator("query", search.extend({
		data: z.string(),
	})),
	async (c) => {
		const uuid = c.req.param("uuid");
		const { pubkey, signature, data } = c.req.valid("query");

		// step 0. Validate data format
		try {
			EventDataSchema.parse(JSON.parse(data));
		} catch (e) {
			return c.json({ error: "Invalid event data format" }, 400);
		}

		// step 1. Verify signature
		const valid = ed.verify(ed.etc.hexToBytes(signature), new TextEncoder().encode(`commit-event:${uuid}`), ed.etc.hexToBytes(pubkey));
		if (!valid) {
			return c.json({ error: "Invalid signature" }, 400);
		};

		// step 2. Fetch existing event to check permissions
		const { metadata } = await c.env.KV.getWithMetadata<EventData, KVMetadata>(`events:${uuid}`, "json");
		if (!metadata) {
			return c.json({ error: "Event not found" }, 404);
		}

		const permissions = metadata.access[pubkey];
		if (!permissions || !permissions.w) {
			return c.json({ error: "Access denied" }, 403);
		}

		// step 3. Update event in KV
		await c.env.KV.put(`events:${uuid}`, data, {
			metadata,
		});

		return renderSignCallbackPage(c, {
			message: `get-event:${uuid}`,
			path: `${c.req.url.replace("/commit", "/content")}`,
		});
	},
)

export default app;

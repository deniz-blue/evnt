import { Hono } from "hono";
import { renderSignCallbackPage } from "./renderer";
import { etag } from "hono/etag";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";
import { zValidator } from "@hono/zod-validator";
import { EventDataSchema, type EventData } from "@evnt/schema";
import z from "zod";
import * as ed from "@noble/ed25519";
import { sha512 } from "@noble/hashes/sha2.js";
ed.hashes.sha512 = sha512;

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use(prettyJSON());
app.use("*", cors({
	origin: "*",
	allowHeaders: [
		"Content-Type",
		"If-None-Match",
	],
	exposeHeaders: [
		"ETag",
		"Content-Encoding",
	],
}));

const VANTAGE_ORIGIN = import.meta.env.DEV ? "http://127.0.0.1:5173" : "https://vantage.deniz.blue";
const REDIRECTOR_ORIGIN = "https://event.nya.pub";

app.get("/", (c) => {
	return c.json({
		message: "Workers KV Storage for Evnt. Visit /new to create a new event.",
	});
});

app.get("/new", (c) => {
	return renderSignCallbackPage(c, {
		message: "new-event",
		path: "/api/v0/events/new",
		search: [
			...searchIncludeSign,
		],
	});
});

type Permissions = {
	r: boolean;
	w: boolean;
};

type KVMetadata = {
	access: Record<string, Permissions>;
};

const searchIncludeSign: [string, string][] = [
	["signature", "SIGNATURE"],
	["pubkey", "PUBLIC_KEY"],
];

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
		const { pubkey, signature } = c.req.valid("query");
		const valid = ed.verify(ed.etc.hexToBytes(signature), new TextEncoder().encode("new-event"), ed.etc.hexToBytes(pubkey));
		if (!valid) {
			return c.json({ error: "Invalid signature" }, 400);
		};

		const uuid = crypto.randomUUID();

		const data: EventData = {
			v: 0,
			name: {},
			components: [
				{
					type: "link",
					data: {
						url: `${c.req.url.replace("/new", `/${uuid}/edit`).split("?")[0]}`,
						name: {
							en: "Edit Event",
						},
					},
				},
			],
		};

		const metadata: KVMetadata = {
			access: {
				[pubkey]: { r: true, w: true },
			},
		};

		await c.env.KV.put(`events:${uuid}`, JSON.stringify(data), {
			metadata,
		});

		return c.redirect(`${VANTAGE_ORIGIN}/form?${new URLSearchParams({
			data: JSON.stringify(data),
			"redirect-to": `${c.req.url.replace("/new", `/${uuid}/hook`).split("?")[0]}`,
		})}`);
	},
);

// Unsigned endpoint!
app.get(
	"/api/v0/events/:uuid/edit",
	async (c) => {
		const uuid = c.req.param("uuid");
		return renderSignCallbackPage(c, {
			message: `get-event:${uuid}`,
			path: `${VANTAGE_ORIGIN}/form`,
			search: [
				["redirect-to", `${c.req.url.replace("/edit", "/hook").split("?")[0]}`],
				["source", `${c.req.url.replace("/edit", "/content").split("?")[0] + "?pubkey=PUBLIC_KEY&curve=ed25519&signature=SIGNATURE"}`],
			],
		});
	},
);

// Unsigned endpoint!
app.get(
	"/api/v0/events/:uuid/hook",
	zValidator("query", z.object({
		data: z.string(),
	})),
	async (c) => {
		const uuid = c.req.param("uuid");
		const { data } = c.req.valid("query");
		return renderSignCallbackPage(c, {
			message: `commit-event:${uuid}`,
			path: `${c.req.url.replace("/hook", "/commit").split("?")[0]}`,
			search: [
				["data", data],
				...searchIncludeSign,
			],
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

		const contentUrl = c.req.url.replace("/commit", "/content").split("?")[0];
		return renderSignCallbackPage(c, {
			message: `get-event:${uuid}`,
			path: REDIRECTOR_ORIGIN,
			search: [
				["action", "view-event"],
				["source", `${contentUrl}?pubkey=PUBLIC_KEY&signature=SIGNATURE`],
			],
		});
	},
)

export default app;

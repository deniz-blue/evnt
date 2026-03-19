import { CompositeDidDocumentResolver, CompositeHandleResolver, DohJsonHandleResolver, LocalActorResolver, PlcDidDocumentResolver, WebDidDocumentResolver, WellKnownHandleResolver } from "@atcute/identity-resolver";
import type { EventIntent } from "./intent";
import { Client, simpleFetchHandler } from "@atcute/client";
import { parseResourceUri } from "@atcute/lexicons";
import { type EventData, EventDataSchema } from "@evnt/schema";
import type { } from "@atcute/atproto";

const actorResolver = new LocalActorResolver({
	handleResolver: new CompositeHandleResolver({
		methods: {
			dns: new DohJsonHandleResolver({ dohUrl: 'https://mozilla.cloudflare-dns.com/dns-query' }),
			http: new WellKnownHandleResolver(),
		},
	}),
	didDocumentResolver: new CompositeDidDocumentResolver({
		methods: {
			plc: new PlcDidDocumentResolver(),
			web: new WebDidDocumentResolver(),
		},
	}),
});

export const fetchATProtoRecord = async (atUri: string): Promise<Record<string, unknown> | null> => {
	const parsed = parseResourceUri(atUri);
	if (!parsed.ok || !parsed.value.collection || !parsed.value.rkey) return null;

	const { pds } = await actorResolver.resolve(parsed.value.repo);

	const rpc = new Client({
		handler: simpleFetchHandler({
			service: pds,
		}),
	});

	const res = await rpc.get("com.atproto.repo.getRecord", {
		params: {
			repo: parsed.value.repo,
			collection: parsed.value.collection,
			rkey: parsed.value.rkey,
		},
	});

	if (!res.ok) throw new Error(`Failed to fetch record: ${JSON.stringify(res)}`);

	return res.data.value;
};

export const fetchEventData = async (intent: EventIntent): Promise<EventData | null> => {
	if (intent.at) {
		return EventDataSchema.parse(await fetchATProtoRecord(intent.at));
	} else if (intent.url) {
		const res = await fetch(intent.url);
		if (!res.ok) return null;
		const json = await res.json();
		return EventDataSchema.parse(json);
	} else return null;
};


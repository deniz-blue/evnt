import type { } from "@atcute/atproto";
import { CompositeDidDocumentResolver, LocalActorResolver, PlcDidDocumentResolver, WebDidDocumentResolver, XrpcHandleResolver, CompositeHandleResolver, DohJsonHandleResolver } from "@atcute/identity-resolver";
import { configureOAuth } from "@atcute/oauth-browser-client";

export const handleResolver = new CompositeHandleResolver({
	methods: {
		dns: new DohJsonHandleResolver({
			dohUrl: "https://cloudflare-dns.com/dns-query",
		}),
		http: new XrpcHandleResolver({
			serviceUrl: "https://public.api.bsky.app",
		}),
	},
});

export const didDocumentResolver = new CompositeDidDocumentResolver({
	methods: {
		plc: new PlcDidDocumentResolver(),
		web: new WebDidDocumentResolver(),
	},
});

export const identityResolver = new LocalActorResolver({
	handleResolver,
	didDocumentResolver,
});

if (typeof window !== "undefined") {
	configureOAuth({
		metadata: {
			client_id: import.meta.env.VITE_OAUTH_CLIENT_ID,
			redirect_uri: import.meta.env.VITE_OAUTH_REDIRECT_URI,
		},
		identityResolver,
	});
}

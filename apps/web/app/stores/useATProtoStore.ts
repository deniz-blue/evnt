import { create } from "zustand";
import { configureOAuth, createAuthorizationUrl, finalizeAuthorization, OAuthUserAgent, type Session } from "@atcute/oauth-browser-client";
import type { EventData } from "@evnt/schema";
import { CompositeDidDocumentResolver, LocalActorResolver, PlcDidDocumentResolver, WebDidDocumentResolver, XrpcHandleResolver } from "@atcute/identity-resolver";
import { Client } from "@atcute/client";
import { isDid, isHandle, type Did } from "@atcute/lexicons/syntax";
import type {} from "@atcute/atproto";

configureOAuth({
	metadata: {
		client_id: import.meta.env.VITE_OAUTH_CLIENT_ID,
		redirect_uri: import.meta.env.VITE_OAUTH_REDIRECT_URI,
	},
	identityResolver: new LocalActorResolver({
		handleResolver: new XrpcHandleResolver({
			serviceUrl: "https://public.api.bsky.app",
		}),
		didDocumentResolver: new CompositeDidDocumentResolver({
			methods: {
				plc: new PlcDidDocumentResolver(),
				web: new WebDidDocumentResolver(),
			},
		}),
	}),
});

export interface ATProtoAuthStore {
	session: Session | null;
	agent: OAuthUserAgent | null;
	rpc: Client | null;

	finalizeAuthorization: (params: URLSearchParams) => Promise<void>;
	signIn: (identifier: string) => Promise<void>;
	signOut: () => Promise<void>;

	createEventRecord: (data: EventData) => Promise<void>;
}

export const useATProtoAuthStore = create<ATProtoAuthStore>((set, get) => ({
	session: null,
	agent: null,
	rpc: null,

	finalizeAuthorization: async (params: URLSearchParams) => {
		const { session } = await finalizeAuthorization(params);
		const agent = new OAuthUserAgent(session);
		const rpc = new Client({ handler: agent })
		set({ session, agent, rpc });
	},

	signIn: async (input: string) => {
		console.log("Signing into atproto with input:", input);

		const authUrl = await createAuthorizationUrl({
			target: (isDid(input) || isHandle(input))
				? { type: "account", identifier: input }
				: { type: "pds", serviceUrl: input },
			scope: import.meta.env.VITE_OAUTH_SCOPE,
		});

		await new Promise(resolve => setTimeout(resolve, 250));

		window.location.assign(authUrl);
	},

	signOut: async () => {

	},

	createEventRecord: async (data: EventData) => {

	},
}));

export const getAvatarOfDid = (did: Did) => {
	return `https://blobs.blue/${did}/avatar-thumb`;
};

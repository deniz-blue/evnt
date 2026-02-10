import { create } from "zustand";
import { configureOAuth, createAuthorizationUrl, finalizeAuthorization, getSession, listStoredSessions, OAuthUserAgent, type Session } from "@atcute/oauth-browser-client";
import type { EventData } from "@evnt/schema";
import { CompositeDidDocumentResolver, LocalActorResolver, PlcDidDocumentResolver, WebDidDocumentResolver, XrpcHandleResolver } from "@atcute/identity-resolver";
import { Client } from "@atcute/client";
import { isDid, isHandle, type Did } from "@atcute/lexicons/syntax";
import type { } from "@atcute/atproto";
import { persist } from "zustand/middleware";
import { LOCALSTORAGE_KEYS } from "../constants";

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

	initialize: () => Promise<void>;

	startAuthorization: (identifier: string) => Promise<void>;
	finishAuthorization: (params: URLSearchParams) => Promise<void>;
	signOut: () => Promise<void>;

	allSessions: () => Did[];
}

export const useATProtoAuthStore = create<ATProtoAuthStore>((set, get) => ({
	session: null,
	agent: null,
	rpc: null,

	initialize: async () => {
		const storedSessions = listStoredSessions();
		const mostRecentSession = storedSessions[0];
		if (!mostRecentSession) return;
		const session = await getSession(mostRecentSession, {
			allowStale: true,
		});
		const agent = new OAuthUserAgent(session);
		const rpc = new Client({ handler: agent });
		set({ session, agent, rpc });
	},

	startAuthorization: async (input: string) => {
		console.log("Signing into atproto with input:", input);

		const authUrl = await createAuthorizationUrl({
			target: (isDid(input) || isHandle(input))
				? { type: "account", identifier: input }
				: { type: "pds", serviceUrl: input },
			scope: import.meta.env.VITE_OAUTH_SCOPE,
		});

		// flush storage updates before redirecting
		setTimeout(() => {
			window.location.assign(authUrl);
		}, 0);
	},

	finishAuthorization: async (params: URLSearchParams) => {
		const { session } = await finalizeAuthorization(params);
		const agent = new OAuthUserAgent(session);
		const rpc = new Client({ handler: agent })
		set({ session, agent, rpc });
	},

	signOut: async () => {
		const { agent } = get();
		if (!agent) return;
		await agent.signOut();
		set({ session: null, agent: null, rpc: null });
	},

	allSessions: () => listStoredSessions(),
}));

export const getAvatarOfDid = (did: Did) => {
	return `https://blobs.blue/${did}/avatar-thumb`;
};

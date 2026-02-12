import { create } from "zustand";
import { configureOAuth, createAuthorizationUrl, finalizeAuthorization, getSession, listStoredSessions, OAuthUserAgent, type Session } from "@atcute/oauth-browser-client";
import { CompositeDidDocumentResolver, LocalActorResolver, PlcDidDocumentResolver, WebDidDocumentResolver, XrpcHandleResolver } from "@atcute/identity-resolver";
import { Client } from "@atcute/client";
import { isDid, isHandle, type Did } from "@atcute/lexicons/syntax";
import { useLocaleStore } from "../../stores/useLocaleStore";

export interface ATProtoAuthStore {
	session: Session | null;
	agent: OAuthUserAgent | null;
	rpc: Client | null;

	initialize: () => Promise<void>;

	startAuthorization: (identifier: string) => Promise<void>;
	finishAuthorization: (params: URLSearchParams) => Promise<AuthorizationState>;
	signOut: () => Promise<void>;

	allSessions: () => Did[];
}

export interface AuthorizationState {
	path: string;
	search: string;
	fragment: string;
};

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
			locale: useLocaleStore.getState().language,
			state: {
				search: window.location.search,
				path: window.location.pathname,
				fragment: window.location.hash,
			} as AuthorizationState,
		});

		// flush storage updates before redirecting
		setTimeout(() => {
			window.location.assign(authUrl);
		}, 0);

		// never resolve since the page will be redirected
		return new Promise(() => { });
	},

	finishAuthorization: async (params: URLSearchParams): Promise<AuthorizationState> => {
		const { session, state } = await finalizeAuthorization(params);
		const agent = new OAuthUserAgent(session);
		const rpc = new Client({ handler: agent });
		set({ session, agent, rpc });
		return state as AuthorizationState;
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

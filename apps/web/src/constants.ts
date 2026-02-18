export const EVENT_REDIRECTOR_URL = "https://event.nya.pub" as const;
export const LOCALSTORAGE_PREFIX = "event-app:" as const;
export const LOCALSTORAGE_KEYS = {
	locale: `${LOCALSTORAGE_PREFIX}locale`,
	home: `${LOCALSTORAGE_PREFIX}home`,
	layers: `${LOCALSTORAGE_PREFIX}userdata`,
	jetstreamCursor: `${LOCALSTORAGE_PREFIX}jetstream-cursor`,
	atprotoAccounts: `${LOCALSTORAGE_PREFIX}atproto-accounts`,
} as const;

export const DATABASE_NAME = `${LOCALSTORAGE_PREFIX}events-db` as const;

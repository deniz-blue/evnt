export type EventIntent = {
	type: "event";
	url?: string;
	at?: string;
	data?: string;
};

export type Intent = EventIntent;

export const parseIntent = (url: URL): Intent | null => {
	if (
		(url.pathname === "/event" || url.pathname === "/e")
	) return {
		type: "event",
		url: url.searchParams.get("url") ?? undefined,
		at: url.searchParams.get("at") ?? undefined,
		data: url.searchParams.get("data") ?? undefined,
	};

	// Legacy format
	if (
		url.searchParams.get("action") === "view-event"
	) return {
		type: "event",
		url: (
			url.searchParams.get("source")?.startsWith("http") ? url.searchParams.get("source") : undefined
		) ?? url.searchParams.get("url") ?? undefined,
		at: url.searchParams.get("source")?.startsWith("at") ? url.searchParams.get("source")! : undefined,
	};

	return null;
};

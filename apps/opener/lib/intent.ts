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
	) {
		let intent: EventIntent = {
			type: "event",
		};

		let source = url.searchParams.get("source") ?? url.searchParams.get("url") ?? undefined;
		if (source?.startsWith("at")) intent.at = source;
		else if (source?.startsWith("http")) intent.url = source;

		return intent;
	};

	return null;
};

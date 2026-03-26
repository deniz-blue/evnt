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
	) {
		let intent: EventIntent = {
			type: "event",
		};

		const urlParam = url.searchParams.get("url");
		const at = url.searchParams.get("at");
		const data = url.searchParams.get("data");

		if (urlParam) intent.url = urlParam;
		if (at) intent.at = at;
		if (data) intent.data = data;

		return intent;
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

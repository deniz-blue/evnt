import { Strings } from "./strings.ts";
import { BroadcastChannelKey, clearInstanceUrl, debug, getInstanceUrl, setInstanceUrl } from "./api.ts";
import { render } from "./app.tsx";
import { parseIntent } from "../lib/intent.ts";
import "./init.ts";

async function main() {
	const isIframe = window.self !== window.top;
	const params = new URLSearchParams(window.location.search);
	let uiMessage = "";

	debug("Current instance URL:", getInstanceUrl());

	if (params.has("setInstanceUrl") && !isIframe) {
		const url = params.get("setInstanceUrl")!;
		setInstanceUrl(url);
		new BroadcastChannel(BroadcastChannelKey).postMessage("instanceUrlUpdated");
		console.log("[eventsl.ink] Set instance URL to", url);
		window.history.replaceState({}, document.title, window.location.pathname);
		uiMessage = Strings.Message.Set(url);
		// No return - show UI
	};

	if (params.has("clearInstanceUrl") && !isIframe) {
		clearInstanceUrl();
		new BroadcastChannel(BroadcastChannelKey).postMessage("instanceUrlUpdated");
		debug?.("Instance URL cleared");
		uiMessage = Strings.Message.Cleared;
		window.history.replaceState({}, document.title, window.location.pathname);
		// No return - show UI
	};

	if (params.has("popup")) {
		window.close();
		return;
	};

	const intent = parseIntent(new URL(window.location.href)) ?? undefined;
	debug("Parsed intent:", intent);

	if (intent && getInstanceUrl())
		return window.location.replace(`${getInstanceUrl()}?${new URLSearchParams(intent)}`);

	if (intent)
		uiMessage = Strings.Message.SelectToContinue(intent);

	render({
		message: uiMessage || Strings.Message.None,
		intent,
	});
};

main();




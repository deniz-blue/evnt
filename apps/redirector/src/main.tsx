import { createRoot } from 'react-dom/client'
import { Page, type PageProps } from './ui/Page.tsx'
import './index.css';
import { Strings } from "./strings.ts";

const LocalStorageKey = "event-redirector:instance-url";
export const getInstanceUrl = () => localStorage.getItem(LocalStorageKey);
export const setInstanceUrl = (url: string) => localStorage.setItem(LocalStorageKey, url);
export const clearInstanceUrl = () => localStorage.removeItem(LocalStorageKey);

function showUserInterface(props: PageProps) {
	createRoot(document.getElementById('root')!).render(<Page {...props} />);
};

export const BroadcastChannelKey = "instance-changed";

async function main() {
	const isIframe = window.self !== window.top;
	const params = new URLSearchParams(window.location.search);
	let uiMessage = "";
	const debug = params.has("debug")
		? (...a: any[]) => console.debug("%c[event.nya.pub]", "color: blue; font-weight: bold;", ...a)
		: null;

	if (debug) debug?.("Current instance URL:", getInstanceUrl());

	if (params.has("setInstanceUrl") && !isIframe) {
		const url = params.get("setInstanceUrl")!;
		setInstanceUrl(url);
		new BroadcastChannel(BroadcastChannelKey).postMessage(BroadcastChannelKey);
		console.log("[event.nya.pub] Set instance URL to", url);
		window.history.replaceState({}, document.title, window.location.pathname);
		uiMessage = Strings.Message.Set(url);
		// No return - show UI
	};

	if (params.has("clearInstanceUrl") && !isIframe) {
		clearInstanceUrl();
		debug?.("Instance URL cleared");
		uiMessage = Strings.Message.Cleared;
		window.history.replaceState({}, document.title, window.location.pathname);
		// No return - show UI
	};

	if (params.has("iframe")) {
		if (!isIframe) {
			console.error("[event.nya.pub] Attempted to load iframe script outside of an iframe.");
			return;
		};

		return;
	}

	if (params.has("popup")) {
		window.close();
		return;
	};

	const shouldRedirect = !!params.has("action");
	if (shouldRedirect) {
		if (getInstanceUrl()) {
			window.location.replace(`${getInstanceUrl()}?${params.toString()}`);
			return;
		};

		uiMessage = Strings.Message.SelectToContinue(params);
	};

	showUserInterface({
		message: uiMessage || Strings.Message.None,
	});
};

main();




import { createRoot } from 'react-dom/client'
import { Page, type PageProps } from './ui/Page.tsx'
import './index.css';

const LocalStorageKey = "event-redirector:instance-url";
export const getInstanceUrl = () => localStorage.getItem(LocalStorageKey);
export const setInstanceUrl = (url: string) => localStorage.setItem(LocalStorageKey, url);
export const clearInstanceUrl = () => localStorage.removeItem(LocalStorageKey);

function showUserInterface(props: PageProps) {
	createRoot(document.getElementById('root')!).render(<Page {...props} />);
};

export const BroadcastChannelKey = "instance-changed";

function main() {
	const isIframe = window.self !== window.top;
	const params = new URLSearchParams(window.location.search);
	let uiMessage = "";

	if (params.has("setInstanceUrl") && !isIframe) {
		const url = params.get("setInstanceUrl")!;
		setInstanceUrl(url);
		new BroadcastChannel(BroadcastChannelKey).postMessage(BroadcastChannelKey);
		console.log("[event.nya.pub] Set instance URL to", url);
		window.history.replaceState({}, document.title, window.location.pathname);
		uiMessage = "Instance URL set successfully.";
		// No return - show UI
	};

	if (params.has("clearInstanceUrl") && !isIframe) {
		clearInstanceUrl();
		window.history.replaceState({}, document.title, window.location.pathname);
		uiMessage = "Instance URL cleared successfully.";
		// No return - show UI
	};

	if (params.has("iframe")) {
		if (!isIframe) {
			console.error("[event.nya.pub] Attempted to load iframe script outside of an iframe.");
			return;
		};

		type IFrameInput = {
			type: "isDefaultInstance";
		};

		type IFrameOutput = {
			type: "ready";
		} | {
			type: "instanceChanged";
		} | {
			type: "state";
			isDefaultInstance: boolean;
		};

		const broadcast = new BroadcastChannel(BroadcastChannelKey);
		broadcast.onmessage = (message) => {
			if (message.data === BroadcastChannelKey) {
				(window.parent as WindowProxy).postMessage({
					type: "instanceChanged",
				} as IFrameOutput, "*");
			}
		};

		window.onmessage = (event: MessageEvent<IFrameInput>) => {
			if (event.data.type === "isDefaultInstance") {
				window.parent.postMessage({
					type: "state",
					isDefaultInstance: event.origin === getInstanceUrl(),
				} as IFrameOutput, "*");
			}
		};

		window.parent.postMessage({
			type: "ready",
		} as IFrameOutput, "*");

		return;
	}

	if(params.has("popup")) {
		window.close();
		return;
	};

	const shouldRedirect = !!params.has("action");
	if (shouldRedirect) {
		if (getInstanceUrl()) {
			window.location.replace(`${getInstanceUrl()}?${params.toString()}`);
			return;
		};

		uiMessage = "No instance URL set, please select an instance to continue.";
	};

	showUserInterface({
		message: uiMessage || "Select an instance to redirect to.",
	});
};

main();




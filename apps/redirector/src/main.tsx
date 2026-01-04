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

async function main() {
	const isIframe = window.self !== window.top;
	const params = new URLSearchParams(window.location.search);
	let uiMessage = "";
	const debug = params.has("debug")
		? (...a: any[]) => console.debug("%c[event.nya.pub]", "color: blue; font-weight: bold;", ...a)
		: null;

	if(debug) debug?.("Current instance URL:", getInstanceUrl());

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
		debug?.("Instance URL cleared");
		uiMessage = "Instance URL cleared successfully.";
		window.history.replaceState({}, document.title, window.location.pathname);
		// No return - show UI
	};

	if (params.has("iframe")) {
		debug?.("?iframe mode");
		if (!isIframe) {
			console.error("[event.nya.pub] Attempted to load iframe script outside of an iframe.");
			return;
		};

		let hasStorageAccess = await document.hasStorageAccess().catch(() => false);
		if(!hasStorageAccess) console.warn("[event.nya.pub] No storage access in iframe!");

		type IFrameInput = {
			type: "isDefaultInstance";
		} | {
			type: "unsetDefaultInstance";
		};

		type IFrameOutput = {
			type: "ready";
		} | {
			type: "storageAccessDenied";
		} | {
			type: "instanceChanged";
		} | {
			type: "state";
			isDefaultInstance: boolean;
		};

		const send = (message: IFrameOutput, targetOrigin: string) => {
			const target = (window.parent as WindowProxy);
			if (!target) return debug?.("window.parent not present!", target);
			debug?.("Sending message", message, "to origin", targetOrigin);
			target.postMessage(message, targetOrigin);
		};

		const broadcast = new BroadcastChannel(BroadcastChannelKey);
		broadcast.onmessage = (message) => {
			if (message.data === BroadcastChannelKey) {
				debug?.("Instance changed by another browsing context");
				debug?.("Instance URL is now", getInstanceUrl());
				send({
					type: "instanceChanged",
				}, "*");
			}
		};

		window.onmessage = (event: MessageEvent<IFrameInput>) => {
			debug?.("Message received from", event.origin, "; data:", event.data);
			if (event.data.type === "isDefaultInstance") {
				send({
					type: "state",
					isDefaultInstance: event.origin === getInstanceUrl(),
				}, "*");
			} else if (event.data.type === "unsetDefaultInstance") {
				clearInstanceUrl();
				broadcast.postMessage(BroadcastChannelKey);
				send({
					type: "state",
					isDefaultInstance: false,
				}, "*");
			} else {
				debug?.("Invalid message:", event.data);
			}
		};

		if(!hasStorageAccess) send({ type: "storageAccessDenied" }, "*");
		send({ type: "ready" }, "*");

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

		uiMessage = "No instance URL set, please select an instance to continue.";
	};

	showUserInterface({
		message: uiMessage || "Select an instance to redirect to.",
	});
};

main();




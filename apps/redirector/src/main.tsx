import { createRoot } from 'react-dom/client'
import { Page } from './ui/Page.tsx'
import './index.css';

const LocalStorageKey = "event-redirector:instance-url";
const getInstanceUrl = () => localStorage.getItem(LocalStorageKey);
const setInstanceUrl = (url: string) => localStorage.setItem(LocalStorageKey, url);
const clearInstanceUrl = () => localStorage.removeItem(LocalStorageKey);

function showUserInterface(failed: boolean) {
	createRoot(document.getElementById('root')!).render(<Page failed={failed} />);
};

const BroadcastChannelKey = "instance-changed";

function main() {
	const isIframe = window.self !== window.top;
	const params = new URLSearchParams(window.location.search);

	if (params.has("setInstanceUrl") && !isIframe) {
		const url = params.get("setInstanceUrl")!;
		setInstanceUrl(url);
		new BroadcastChannel(BroadcastChannelKey).postMessage(BroadcastChannelKey);
		console.log("[event.nya.pub] Set instance URL to", url);
	};

	if (params.has("clearInstanceUrl") && !isIframe) {
		clearInstanceUrl();
	};

	if (params.has("iframe")) {
		if (!isIframe) {
			console.error("[event.nya.pub] Attempted to load iframe script outside of an iframe.");
			return;
		};

		type IFrameInput = {
			type: "isSelectedInstance";
		};

		type IFrameOutput = {
			type: "ready";
		} | {
			type: "instanceChanged";
		} | {
			type: "state";
			isSelectedInstance: boolean;
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
			if (event.data.type === "isSelectedInstance") {
				window.parent.postMessage({
					type: "state",
					isSelectedInstance: event.origin === getInstanceUrl(),
				} as IFrameOutput, "*");
			}
		};

		window.parent.postMessage({
			type: "ready",
		} as IFrameOutput, "*");

		return;
	}

	const shouldRedirect = !!params.has("action");
	if (shouldRedirect && !!getInstanceUrl()) {
		window.location.replace(`${getInstanceUrl()}?${params.toString()}`);
	} else {
		showUserInterface(shouldRedirect);
	};
};

main();




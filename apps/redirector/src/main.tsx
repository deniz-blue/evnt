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
	const params = new URLSearchParams(window.location.search);

	if (params.has("setInstanceUrl")) {
		const url = params.get("setInstanceUrl")!;
		setInstanceUrl(url);
		new BroadcastChannel(BroadcastChannelKey).postMessage(BroadcastChannelKey);
	};

	if (params.has("clearInstanceUrl")) {
		clearInstanceUrl();
	};

	if (params.has("iframe")) {
		type IFrameInput = {
			type: "isSelectedInstance";
		};

		type IFrameOutput = {
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
				const isSelectedInstance = event.origin === getInstanceUrl();
				(event.source as WindowProxy).postMessage({
					type: "state",
					isSelectedInstance,
				} as IFrameOutput, event.origin);
			}
		};

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




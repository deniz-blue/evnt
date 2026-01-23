import { BroadcastChannelKey, clearInstanceUrl, getInstanceUrl } from "./main";

export const IframeMode = async () => {
	const params = new URLSearchParams(window.location.search);
	const debug = params.has("debug")
		? (...a: any[]) => console.debug("%c[event.nya.pub]", "color: blue; font-weight: bold;", ...a)
		: null;

	debug?.("?iframe mode");

	let hasStorageAccess = await document.hasStorageAccess().catch(() => false);
	if (!hasStorageAccess) console.warn("[event.nya.pub] No storage access in iframe!");

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

	if (!hasStorageAccess) send({ type: "storageAccessDenied" }, "*");
	send({ type: "ready" }, "*");
};

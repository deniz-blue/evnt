import { create } from "zustand";

export const EVENT_REDIRECTOR_URL = "https://event.nya.pub";
// export const EVENT_REDIRECTOR_URL = "http://localhost:5174";

export const useEventRedirectorStore = create<{
    iframe: HTMLIFrameElement | null;
    initialize: () => void;
    isActiveInstance: boolean | null;
    setAsActiveInstance: () => void;
}>((set) => ({
    iframe: null,
    isActiveInstance: null,
    initialize: () => {
        const iframe = document.createElement("iframe");
        iframe.style.visibility = "hidden";
        iframe.src = `${EVENT_REDIRECTOR_URL}/?iframe`;
        iframe.id = "redirector-iframe";
        iframe.ariaHidden = "true";
        iframe.sandbox.add("allow-scripts", "allow-same-origin");

        const request = () => {
            iframe.contentWindow?.postMessage({ type: "isSelectedInstance" }, EVENT_REDIRECTOR_URL);
        };

        window.addEventListener("message", (event) => {
            console.log("Received message event", event);
            if (event.origin !== EVENT_REDIRECTOR_URL) return;
            console.log("Received message from redirector iframe", event.data);
            if (event.data.type === "instanceChanged") return request();
            if (event.data.type === "state") {
                set({ isActiveInstance: event.data.isSelectedInstance });
            }
        });

        iframe.onload = () => request();
        document.body.appendChild(iframe);

        set({ iframe });
    },
    setAsActiveInstance: () => {
        window.open(`${EVENT_REDIRECTOR_URL}/?${new URLSearchParams({
            setInstanceUrl: window.location.origin,
            popup: "true",
        }).toString()}`, "_blank", "popup=true");
    },
}));

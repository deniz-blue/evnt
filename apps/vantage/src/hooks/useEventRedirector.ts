import { create } from "zustand";
import { EVENT_REDIRECTOR_URL } from "../constants";

export const useEventRedirectorStore = create<{
    iframe: HTMLIFrameElement | null;
    initialize: () => void;
    isActiveInstance: boolean | null;
    setAsActiveInstance: () => void;
    unsetAsActiveInstance: () => void;
}>((set, get) => ({
    iframe: null,
    isActiveInstance: null,
    initialize: () => {
        if(get().iframe) return;

        const iframe = document.createElement("iframe");
        iframe.style.visibility = "hidden";
        iframe.src = `${EVENT_REDIRECTOR_URL}/?${new URLSearchParams({
            iframe: "true",
            debug: "true",
        }).toString()}`;
        iframe.id = "redirector-iframe";
        iframe.ariaHidden = "true";
        // iframe.sandbox.add("allow-scripts", "allow-same-origin");

        const request = () => {
            if(!iframe.contentWindow) console.error("Iframe contentWindow is not available");
            iframe.contentWindow?.postMessage({ type: "isDefaultInstance" }, EVENT_REDIRECTOR_URL);
        };

        window.addEventListener("message", (event) => {
            if (event.origin !== EVENT_REDIRECTOR_URL) return;
            console.debug("Received message from event redirector:", event.data);
            if (event.data.type === "instanceChanged" || event.data.type === "ready") return request();
            if (event.data.type === "state") {
                set({ isActiveInstance: event.data.isDefaultInstance });
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
    unsetAsActiveInstance: () => {
        get().iframe?.contentWindow?.postMessage({ type: "unsetDefaultInstance" }, EVENT_REDIRECTOR_URL);
    },
}));

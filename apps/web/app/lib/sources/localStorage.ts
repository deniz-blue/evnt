import type { Source } from "../../models/AppEvent";
import type { SourceProvider } from "./types";

const prefix = "events.deniz.blue:event-data/";

export const localStorageProvider: SourceProvider<"localStorage"> = {
    id: "localStorage",
    listEvents: async () => {
        const sources: Extract<Source, { type: "localStorage" }>[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith(prefix)) {
                sources.push({ type: "localStorage", key });
            }
        }
        return sources;
    },
    getEvent: async (source) => {
        const item = localStorage.getItem(source.key);
        return item ? JSON.parse(item) : null;
    },
};

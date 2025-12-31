import { create } from "zustand";
import type { AppEvent } from "../../models/AppEvent";
import type { EventData } from "@evnt/format";
import { openDB, type IDBPDatabase } from "idb";

interface EventStore {
    db: IDBPDatabase | null;
    channel: BroadcastChannel | null;
    events: AppEvent[];
    initialize: () => Promise<void>;
    sync: () => Promise<void>;
    createLocalEvent: (data: EventData) => void;
    deleteLocalEvent: (id: number) => void;
}

const DatabaseName = "event-app:events-db";
const StoreName = "events";

export const useEventStore = create<EventStore>((set, get) => ({
    events: [],
    db: null,
    channel: new BroadcastChannel("event-store"),
    initialize: async () => {
        const db = await openDB(DatabaseName, 4, {
            upgrade(db) {
                db.createObjectStore(StoreName, {
                    keyPath: "id",
                    autoIncrement: true,
                });
            },
        });
        set({ db });

        get().channel?.addEventListener("message", async (msg) => {
            if (msg.data === "update") {
                await get().sync();
            }
        });
        
        await get().sync();
    },
    sync: async () => {
        const allEvents = await get().db?.getAll(StoreName) || [];
        set({ events: allEvents });
    },
    createLocalEvent: async (data: EventData) => {
        await get().db?.add(StoreName, { source: { type: "local" }, data, timestamp: Date.now() });
        get().channel?.postMessage("update");
        await get().sync();
    },
    deleteLocalEvent: async (id: number) => {
        await get().db?.delete(StoreName, id);
        get().channel?.postMessage("update");
        await get().sync();
    },
}));

useEventStore.getState().initialize();

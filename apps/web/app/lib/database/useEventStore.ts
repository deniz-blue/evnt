import { create } from "zustand";
import type { AppEvent } from "../../models/AppEvent";
import type { EventData } from "@repo/model";
import { openDB, type IDBPDatabase } from "idb";

interface EventStore {
    db: IDBPDatabase | null;
    events: AppEvent[];
    initialize: () => Promise<void>;
    sync: () => Promise<void>;
    createLocalEvent: (data: EventData) => void;
}

const StoreName = "events";

export const useEventStore = create<EventStore>((set, get) => ({
    events: [],
    db: null,
    initialize: async () => {
        const db = await openDB("event-store", 4, {
            upgrade(db) {
                db.createObjectStore(StoreName, {
                    keyPath: "id",
                    autoIncrement: true,
                });
            },
        });
        set({ db });
        await get().sync();
    },
    sync: async () => {
        const allEvents = await get().db?.getAll(StoreName) || [];
        set({ events: allEvents });
    },
    createLocalEvent: async (data: EventData) => {
        await get().db?.add(StoreName, { source: { type: "local" }, data, timestamp: Date.now() });
        await get().sync();
    },
}));

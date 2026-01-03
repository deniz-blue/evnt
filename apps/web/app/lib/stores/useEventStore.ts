import { create } from "zustand";
import type { AppEvent } from "../../models/AppEvent";
import type { EventData } from "@evnt/schema";
import { createIDBStore } from "./createIDBStore";

interface EventStore {
    getEvents: () => AppEvent[];
    createLocalEvent: (data: EventData) => void;
    deleteLocalEvent: (id: number) => void;
}

const DatabaseName = "event-app:events-db";
const StoreName = "events";

export const useEventDatabase = createIDBStore<AppEvent>({
    databaseName: DatabaseName,
    storeName: StoreName,
});

export const useEventStore = create<EventStore>((set, get) => ({
    getEvents: () => {
        return useEventDatabase.getState().data;
    },
    createLocalEvent: async (data: EventData) => {
        useEventDatabase.getState().mutate(async (db) => {
            await db.add(StoreName, { source: { type: "local" }, data, timestamp: Date.now() });
        });
    },
    deleteLocalEvent: async (id: number) => {
        await useEventDatabase.getState().mutate(async (db) => {
            await db.delete(StoreName, id);
        });
    },
}));

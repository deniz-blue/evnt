import { create } from "zustand";
import type { StoredEvent } from "../../models/StoredEvent";
import { EventDataSchema, type EventData } from "@evnt/schema";
import { createIDBSlice, type IDBStore } from "./createIDBSlice";

interface EventStore {
    createLocalEvent: (data: EventData) => Promise<void>;
    createRemoteEvent: (url: string, data: EventData) => Promise<void>;
    deleteLocalEvent: (id: number) => Promise<void>;
    refetchEvent: (id: number) => Promise<void>;
    updateEventData: (id: number, data: EventData) => Promise<void>;
}

const DatabaseName = "event-app:events-db";
const StoreName = "events";

export const useEventStore = create<EventStore & IDBStore<StoredEvent>>((set, get, s) => ({
    ...createIDBSlice<StoredEvent>({
        databaseName: DatabaseName,
        storeName: StoreName,
    })(set, get, s),
    
    createLocalEvent: async (data: EventData) => {
        get().dbMutate(async (db) => {
            await db.add(StoreName, { source: { type: "local" }, data, timestamp: Date.now() });
        });
    },

    createRemoteEvent: async (url: string, data: EventData) => {
        get().dbMutate(async (db) => {
            await db.add(StoreName, { source: { type: "url", data: url }, data, timestamp: Date.now() });
        });
    },

    deleteLocalEvent: async (id: number) => {
        await get().dbMutate(async (db) => {
            await db.delete(StoreName, id);
        });
    },

    refetchEvent: async (id: number) => {
        const storedEvent = get().data.find(e => e.id === id);
        if (!storedEvent || storedEvent.source.type !== "url") return;
        const url = storedEvent.source.data;

        const response = await fetch(url);
        if (!response.ok) {
            console.error("Failed to fetch event data from URL:", response.statusText);
            return;
        }

        const eventDataJson = await response.json();
        const eventData = EventDataSchema.parse(eventDataJson);
        await get().updateEventData(id, eventData);
    },

    updateEventData: async (id: number, data: EventData) => {
        await get().dbMutate(async (db) => {
            const storedEvent = get().data.find(e => e.id === id);
            if (!storedEvent) return;
            await db.put(StoreName, { ...storedEvent, data });
        });
    },
}));

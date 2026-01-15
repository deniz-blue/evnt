import { create } from "zustand";
import type { StoredEvent } from "../lib/models/StoredEvent";
import { EventDataSchema, type EventData } from "@evnt/schema";
import { createIDBSlice, type IDBStore } from "./slices/createIDBSlice";
import { createTasksSlice, type TasksStore } from "./slices/createTasksSlice";
import { DATABASE_NAME, STORE_NAME } from "../constants";

interface EventStore {
    createLocalEvent: (data: EventData) => Promise<number>;
    createRemoteEvent: (url: string, data: EventData) => Promise<number>;
    deleteLocalEvent: (id: number) => Promise<void>;
    refetchEvent: (id: number) => Promise<void>;
    updateEventData: (id: number, data: EventData) => Promise<void>;
}

export const useEventStore = create<EventStore & IDBStore<StoredEvent> & TasksStore>((set, get, s) => ({
    ...createTasksSlice()(set, get, s),
    ...createIDBSlice<StoredEvent>({
        databaseName: DATABASE_NAME,
        storeName: STORE_NAME,
    })(set, get, s),
    
    createLocalEvent: async (data: EventData) => {
        return await get().dbMutate(async (db) => {
            return await db.add(STORE_NAME, { source: { type: "local" }, data, timestamp: Date.now() });
        }, {
            title: "Creating local event",
            notify: true,
        }) as number;
    },

    createRemoteEvent: async (url: string, data: EventData) => {
        return await get().dbMutate(async (db) => {
            return await db.add(STORE_NAME, { source: { type: "url", data: url }, data, timestamp: Date.now() });
        }, {
            title: "Creating remote event",
            notify: true,
        }) as number;
    },

    deleteLocalEvent: async (id: number) => {
        await get().dbMutate(async (db) => {
            await db.delete(STORE_NAME, id);
        }, {
            title: "Deleting local event",
            notify: true,
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
            await db.put(STORE_NAME, { ...storedEvent, data });
        });
    },
}));

import type { EventData } from "@evnt/schema";

export interface EventRecord {
    id: string;
    data: EventData;
    // ... any other metadata fields later
};

export interface IDatabase {
    init?: () => Promise<void>;

    // Event Data
    getEvent: (id: string) => Promise<EventRecord | null>;
    deleteEvent: (id: string) => Promise<void>;
    setEventData: (id: string, data: EventData) => Promise<void>;
};

export const db = {} as IDatabase;

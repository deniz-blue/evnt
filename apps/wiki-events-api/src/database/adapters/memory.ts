import type { CreateEventRecord, EventPatchRecord, EventRecord, IDatabase } from "../interface";

export default class MemoryDatabaseImpl implements IDatabase {
    private events = new Map<string, EventRecord>();
    private patches = new Map<string, EventPatchRecord>();

    async getEvent(id: string): Promise<EventRecord | null> {
        return this.events.get(id) || null;
    }

    async updateEvent(event: EventRecord): Promise<void> {
        this.events.set(event.id, event);
    }

    async deleteEvent(id: string): Promise<void> {
        this.events.delete(id);
    }

    async getEventData(id: string): Promise<EventRecord["data"] | null> {
        const event = this.events.get(id);
        return event ? event.data : null;
    }

    async updateEventData(id: string, data: EventRecord["data"]): Promise<void> {
        const event = this.events.get(id);
        if (event) {
            event.data = data;
            this.events.set(id, event);
        }
    }

    async getEventPatches(eventId: string): Promise<EventPatchRecord[]> {
        return Array.from(this.patches.values()).filter(patch => patch.eventId === eventId);
    }

    async createEventPatch(patch: Omit<EventPatchRecord, "id">): Promise<EventPatchRecord["id"]> {
        const id = crypto.randomUUID();
        this.patches.set(id, { id, ...patch });
        return id;
    }

    async getEventPatch(id: string): Promise<EventPatchRecord | null> {
        return this.patches.get(id) || null;
    }

    async updateEventPatch(patch: EventPatchRecord): Promise<void> {
        this.patches.set(patch.id, patch);
    }

    async deleteEventPatch(id: string): Promise<void> {
        this.patches.delete(id);
    }

    async createEvent(record: CreateEventRecord): Promise<EventRecord["id"]> {
        const id = crypto.randomUUID();
        this.events.set(id, { id, ...record });
        return id;
    }
};

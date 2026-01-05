import type { JsonPatch } from "@evnt/json-patch-schema";
import type { EventData } from "@evnt/schema";

export interface EventPatchRecord {
    id: string;
    eventId: string;
    authorId: string;
    patch: JsonPatch;
    timestamp: number;
};

export interface CreateEventPatchRecord extends Omit<EventPatchRecord, "id"> {};

export interface EventRecord {
    id: string;
    data: EventData;
    // ... any other metadata fields later
};

export interface CreateEventRecord extends Omit<EventRecord, "id"> {};

export type CreateFn<TCreateRecord, TRecord extends { id: string }> = (record: TCreateRecord) => Promise<TRecord["id"]>;
export type GetFn<TRecord extends { id: string }> = (id: TRecord["id"]) => Promise<TRecord | null>;
export type UpdateFn<TRecord extends { id: string }> = (record: TRecord) => Promise<void>;
export type DeleteFn<TRecord extends { id: string }> = (id: TRecord["id"]) => Promise<void>;

export interface IEventRepository {
    createEvent: CreateFn<CreateEventRecord, EventRecord>;
    getEvent: GetFn<EventRecord>;
    updateEvent: UpdateFn<EventRecord>;
    deleteEvent: DeleteFn<EventRecord>;
    getEventData: (id: string) => Promise<EventData | null>;
    updateEventData: (id: string, data: EventData) => Promise<void>;
};

export interface IEventPatchesRepository {
    createEventPatch: CreateFn<CreateEventPatchRecord, EventPatchRecord>;
    getEventPatch: GetFn<EventPatchRecord>;
    updateEventPatch: UpdateFn<EventPatchRecord>;
    deleteEventPatch: DeleteFn<EventPatchRecord>;
    getEventPatches: (id: string) => Promise<EventPatchRecord[]>;
};

export interface IUsersRepository {
    // Placeholder for user-related methods
};

export interface IDatabase extends IEventRepository, IEventPatchesRepository {
    init?: () => Promise<void>;
};

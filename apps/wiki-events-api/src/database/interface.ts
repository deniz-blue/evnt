import type { JsonPatch } from "@evnt/json-patch-schema";
import type { EventData } from "@evnt/schema";

export namespace DatabaseTypes {
	export type UserId = `${"github" | "discord"}:${string}`;
	export type UUID = `${string}-${string}-${string}-${string}-${string}`;
	export type EventId = UUID;

	export type EventRecord = {
		id: EventId;
		data: EventData;
	};

	export type EventPatchRecord = {
		id: string;
		eventId: EventId;
		authorId: UserId;
		patch: JsonPatch;
		timestamp: number;
	};

}

export type Repository<T extends Repository.WithId, Config extends Partial<Record<keyof Repository.Methods<T>, string>>> = {
	[K in keyof Config as Config[K] & string]: K extends keyof Repository.Methods<T>
	? Repository.Methods<T>[K]
	: never;
}

export namespace Repository {
	export type WithId = { id: string };
	export type TCreate<T extends WithId> = Omit<T, "id">;
	export type CreateFn<T extends WithId> = (record: TCreate<T>) => Promise<T["id"]>;
	export type GetFn<T extends WithId> = (id: T["id"]) => Promise<T | null>;
	export type UpdateFn<T extends WithId> = (record: T) => Promise<void>;
	export type DeleteFn<T extends WithId> = (id: T["id"]) => Promise<void>;

	export type Methods<T extends WithId> = {
		create: CreateFn<T>;
		get: GetFn<T>;
		update: UpdateFn<T>;
		delete: DeleteFn<T>;
	};
}

export namespace Repositories {
	export interface EventRepository extends Repository<DatabaseTypes.EventRecord, {
		create: "createEvent";
		get: "getEvent";
		update: "updateEvent";
		delete: "deleteEvent";
	}> {
		getEventData: (id: DatabaseTypes.EventId) => Promise<EventData | null>;
		updateEventData: (id: DatabaseTypes.EventId, data: EventData) => Promise<void>;
	};

	export interface EventPatchesRepository extends Repository<DatabaseTypes.EventPatchRecord, {
		create: "createEventPatch";
		get: "getEventPatch";
		update: "updateEventPatch";
		delete: "deleteEventPatch";
	}> {
		getEventPatches: (id: DatabaseTypes.EventId) => Promise<DatabaseTypes.EventPatchRecord[]>;
	};
};

export interface IDatabase extends Repositories.EventRepository, Repositories.EventPatchesRepository {
	init?: () => Promise<void>;
};

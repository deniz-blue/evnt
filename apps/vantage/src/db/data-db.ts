import { openDB, type IDBPDatabase } from "idb";
import { DATABASE_NAME } from "../constants";
import { Logger } from "../lib/util/logger";
import { UtilEventSource, type EventSource } from "./models/event-source";
import type { EventEnvelope } from "./models/event-envelope";
import { $NSID } from "@evnt/schema";

const logger = Logger.main.styledChild("DataDB", "#a6d189");
const loggerBroadcast = Logger.main.styledChild("DataDB > Broadcast", "#81a1c1");

export namespace DataDB {
	export type Key = EventSource;
	export type Value = EventEnvelope;

	export type StoreNames = {
		data: {
			key: Key;
			value: Value;
		};
	};
};

export class DataDB {
	static #db: IDBPDatabase<DataDB.StoreNames> | null = null;
	static #channel: BroadcastChannel | null = null;
	static #listeners: Set<(key: DataDB.Key) => void> = new Set();

	static CHANNEL_NAME = "data-db" as const;
	static MESSAGE_UPDATE = "update" as const;
	static STORE_NAME_DATA = "data" as const;

	static #inferDataType(data: unknown): EventEnvelope.DataType | undefined {
		if (!data || typeof data !== "object") return undefined;
		const obj = data as Record<string, unknown>;
		if (typeof obj.$type === "string") return obj.$type;
		if ("v" in obj && "name" in obj) return $NSID;
		return undefined;
	}

	static async db(): Promise<IDBPDatabase<DataDB.StoreNames>> {
		if (this.#db) return this.#db;
		this.#db = await openDB<DataDB.StoreNames>(DATABASE_NAME, 10, {
			upgrade: async (db, prevVer, newVer, transaction, event) => {
				if (!db.objectStoreNames.contains(this.STORE_NAME_DATA)) {
					db.createObjectStore(this.STORE_NAME_DATA);
				} else if (prevVer < 7) {
					db.deleteObjectStore(this.STORE_NAME_DATA);
					db.createObjectStore(this.STORE_NAME_DATA);
				} else if (prevVer == 7) {
					const store = transaction.objectStore(this.STORE_NAME_DATA);
					await store.openCursor().then(async function upgradeCursor(cursor) {
						if (!cursor) return;
						const oldKey = cursor.key as any;
						await cursor.delete().then(() => {
							let newKey: DataDB.Key = UtilEventSource.fromOld(oldKey);
							return store.delete(oldKey)
								.then(() => store.put(cursor.value, newKey))
								.then(() => cursor.continue().then(upgradeCursor));
						});
					});
				}

				if (prevVer > 0 && prevVer < 10 && db.objectStoreNames.contains(this.STORE_NAME_DATA)) {
					const store = transaction.objectStore(this.STORE_NAME_DATA);
					const cursor = await store.openCursor();
					if (cursor) for await (const c of cursor) {
						const value = c.value as any;
						const upgraded: EventEnvelope = {
							data: value?.data ?? null,
							dataType: value?.dataType ?? this.#inferDataType(value?.data),
							rev: value?.rev,
							err: value?.err,
						};
						await c.update(upgraded);
					}
				}

				logger.log("Database upgraded");
			},
			blocking() {
				// If another tab tries to upgrade, close this connection
				if (DataDB.#db) {
					DataDB.#db.close();
					DataDB.#db = null;
					logger.log("Database closed due to version change in another tab.");
				}
			},
			blocked() {
				logger.log("Update blocked: please close other tabs running this app.");
			}
		}).catch((err) => {
			logger.log("Failed to open DataDB:", err);
			throw err;
		});
		logger.log("initialized");
		return this.#db;
	}

	static emitUpdate(key: DataDB.Key) {
		this.channel().postMessage(key);
		this.#dispatchUpdateEvent(key);
	}

	static #dispatchUpdateEvent(key: DataDB.Key) {
		for (const listener of this.#listeners) listener(key);
		logger.log(`Key updated`, key);
	}

	static channel(): BroadcastChannel {
		if (!this.#channel) {
			this.#channel = new BroadcastChannel(this.CHANNEL_NAME);
			this.#channel.addEventListener("message", (msg: MessageEvent<DataDB.Key>) => {
				this.#dispatchUpdateEvent(msg.data);
				loggerBroadcast.log(`Message`, msg.data);
			});
			loggerBroadcast.log("initialized");
		};

		return this.#channel;
	}

	static async has(key: DataDB.Key): Promise<boolean> {
		const db = await this.db();
		return !!await db.getKey(this.STORE_NAME_DATA, key);
	}

	static async get(key: DataDB.Key): Promise<DataDB.Value | null> {
		const db = await this.db();
		const entry = await db.get(this.STORE_NAME_DATA, key) || null;
		logger.log("Get", [key, entry]);
		return entry;
	}

	static async put(key: DataDB.Key, entry: DataDB.Value): Promise<void> {
		const db = await this.db();
		await db.put(this.STORE_NAME_DATA, entry, key);
		logger.log("Put", [key, entry]);
		this.emitUpdate(key);
	}

	static async delete(key: DataDB.Key): Promise<void> {
		const db = await this.db();
		await db.delete(this.STORE_NAME_DATA, key);
		this.emitUpdate(key);
	}

	static async getAllKeys(): Promise<DataDB.Key[]> {
		const db = await this.db();
		return await db.getAllKeys(this.STORE_NAME_DATA);
	}

	static onUpdate(callback: (key: DataDB.Key) => void): () => void {
		this.channel();
		this.#listeners.add(callback);
		return () => this.#listeners.delete(callback);
	}
};

// Expose for debugging
// @ts-ignore
if (typeof window !== "undefined") window.DataDB = DataDB;

import { openDB, type IDBPDatabase } from "idb";
import { DATABASE_NAME } from "../constants";
import type { EventData } from "@evnt/schema";
import { Logger } from "../lib/util/logger";
import { UtilEventSource, type EventDataSource } from "./models/event-source";

const logger = Logger.main.styledChild("DataDB", "#a6d189");
const loggerBroadcast = Logger.main.styledChild("DataDB > Broadcast", "#81a1c1");

export namespace DataDB {
	export type Key = EventDataSource;

	export interface Value {
		data: EventData;
	}

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

	static async db(): Promise<IDBPDatabase<DataDB.StoreNames>> {
		if (this.#db) return this.#db;
		this.#db = await openDB<DataDB.StoreNames>(DATABASE_NAME, 8, {
			upgrade: (db, prevVer, newVer, transaction, event) => {
				if (prevVer == 7) {
					if (db.objectStoreNames.contains(this.STORE_NAME_DATA)) {
						const store = transaction.objectStore(this.STORE_NAME_DATA);
						store.openCursor().then(function upgradeCursor(cursor) {
							if (!cursor) return;
							const oldKey = cursor.key as any;
							cursor.delete().then(() => {
								let newKey: DataDB.Key = UtilEventSource.fromOld(oldKey);
								store.delete(oldKey)
									.then(() => store.put(cursor.value, newKey))
									.then(() => cursor.continue().then(upgradeCursor));
							});
						});
					} else {
						db.createObjectStore(this.STORE_NAME_DATA);
					}
				} else {
					if (db.objectStoreNames.contains(this.STORE_NAME_DATA))
						db.deleteObjectStore(this.STORE_NAME_DATA);
					db.createObjectStore(this.STORE_NAME_DATA);
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

	static #updated(key: DataDB.Key) {
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
		this.#updated(key);
	}

	static async delete(key: DataDB.Key): Promise<void> {
		const db = await this.db();
		await db.delete(this.STORE_NAME_DATA, key);
		this.#updated(key);
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

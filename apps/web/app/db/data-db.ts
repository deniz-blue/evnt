import { openDB, type IDBPDatabase } from "idb";
import { DATABASE_NAME } from "../constants";
import type { EventData } from "@evnt/schema";
import { Logger } from "../lib/util/logger";

const logger = Logger.main.styledChild("DataDB", "blue");
const loggerBroadcast = logger.styledChild("Broadcast", "green");

export namespace DataDB {
	export interface Entry {
		data: EventData;
	}

	export type StoreNames = {
		data: {
			key: string;
			value: Entry;
		};
	};
};

export class DataDB {
	static #db: IDBPDatabase<DataDB.StoreNames> | null = null;
	static #channel: BroadcastChannel | null = null;
	static #listeners: Set<(key: string) => void> = new Set();

	static CHANNEL_NAME = "data-db" as const;
	static MESSAGE_UPDATE = "update" as const;
	static STORE_NAME_DATA = "data" as const;

	static async db(): Promise<IDBPDatabase<DataDB.StoreNames>> {
		if (this.#db) return this.#db;
		this.#db = await openDB<DataDB.StoreNames>(DATABASE_NAME, 7, {
			upgrade: (db) => {
				if (db.objectStoreNames.contains(this.STORE_NAME_DATA))
					db.deleteObjectStore(this.STORE_NAME_DATA);

				db.createObjectStore(this.STORE_NAME_DATA);
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

	static #updated(key: string) {
		this.channel().postMessage(key);
		this.#dispatchUpdateEvent(key);
	}

	static #dispatchUpdateEvent(key: string) {
		for (const listener of this.#listeners) listener(key);
		logger.log(`Key updated`, key);
	}

	static channel(): BroadcastChannel {
		if (!this.#channel) {
			this.#channel = new BroadcastChannel(this.CHANNEL_NAME);
			this.#channel.addEventListener("message", (msg: MessageEvent<string>) => {
				this.#dispatchUpdateEvent(msg.data);
				loggerBroadcast.log(`Message`, msg.data);
			});
			loggerBroadcast.log("initialized");
		};

		return this.#channel;
	}

	static async has(key: string): Promise<boolean> {
		const db = await this.db();
		return !!await db.getKey(this.STORE_NAME_DATA, key);
	}

	static async get(key: string): Promise<DataDB.Entry | null> {
		const db = await this.db();
		const entry = await db.get(this.STORE_NAME_DATA, key) || null;
		logger.log("Get", [key, entry]);
		return entry;
	}

	static async put(key: string, entry: DataDB.Entry): Promise<void> {
		const db = await this.db();
		await db.put(this.STORE_NAME_DATA, entry, key);
		logger.log("Put", [key, entry]);
		this.#updated(key);
	}

	static async delete(key: string): Promise<void> {
		const db = await this.db();
		await db.delete(this.STORE_NAME_DATA, key);
		this.#updated(key);
	}

	static async getAllKeys(): Promise<string[]> {
		const db = await this.db();
		return await db.getAllKeys(this.STORE_NAME_DATA);
	}

	static onUpdate(callback: (key: string) => void): () => void {
		this.channel();
		this.#listeners.add(callback);
		return () => this.#listeners.delete(callback);
	}
};

// Expose for debugging
// @ts-ignore
if (typeof window !== "undefined") window.DataDB = DataDB;

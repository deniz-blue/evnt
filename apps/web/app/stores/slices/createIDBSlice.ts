import { openDB, type IDBPDatabase } from "idb";
import { type StateCreator } from "zustand";
import type { TaskContext, TaskExecute, TaskMetadataInput, TasksStore } from "./createTasksSlice";

export interface IDBStore<TData = any> {
    db: IDBPDatabase | null;
    dbSyncChannel: BroadcastChannel | null;
    data: TData[];
    getDB: () => Promise<IDBPDatabase>;
    dbUninitialize: () => Promise<void>;
    dbSync: () => Promise<void>;
    dbBroadcastSync: () => Promise<void>;
    addTaskWithDB: <TOutput>(meta: TaskMetadataInput, run: TaskExecute<TOutput, TaskContext & { db: IDBPDatabase }>) => Promise<TOutput>;
    dbMutate: (fn: (db: IDBPDatabase) => Promise<void>, meta?: TaskMetadataInput) => Promise<void>;
};

export interface CreateIDBSliceOptions {
    databaseName: string;
    storeName: string;
};

export const createIDBSlice = <TData>({
    databaseName,
    storeName,
}: CreateIDBSliceOptions): StateCreator<
    IDBStore<TData> & TasksStore,
    [],
    [],
    IDBStore<TData>
> => (set, get) => ({
    db: null,
    dbSyncChannel: null,
    data: [] as TData[],
    addTaskWithDB<T>(meta: TaskMetadataInput, run: TaskExecute<T, TaskContext & { db: IDBPDatabase }>) {
        return get().addTask<T>(meta, async (ctx) => {
            return await run({
                ...ctx,
                db: await get().getDB(),
            });
        });
    },
    getDB: async () => {
        return get().db || await get().addTask({
            title: "Initializing database"
        }, async () => {
            const db = await openDB(databaseName, 4, {
                upgrade(db) {
                    db.createObjectStore(storeName, {
                        keyPath: "id",
                        autoIncrement: true,
                    });
                },
            });

            const dbSyncChannel = new BroadcastChannel(`${databaseName}-channel`);

            dbSyncChannel.onmessage = async (msg) => {
                if (msg.data === "update") {
                    await get().dbSync();
                }
            };

            set({ db, dbSyncChannel });

            get().dbSync();

            return db;
        });
    },
    dbUninitialize: async () => {
        const { db, dbSyncChannel } = get();
        set({ db: null, dbSyncChannel: null, data: [] });
        if (dbSyncChannel) dbSyncChannel.onmessage = null;
        dbSyncChannel?.close();
        db?.close();
    },
    dbSync: async () => {
        await get().addTaskWithDB({
            title: "Syncing database",
        }, async () => {
            const data: TData[] = await (await get().getDB()).getAll(storeName) || [];
            set({ data });
        });
    },
    dbBroadcastSync: async () => {
        get().dbSyncChannel?.postMessage("update");
        await get().dbSync();
    },
    dbMutate: async (fn, meta) => {
        await get().addTaskWithDB(meta || {
            title: "Updating database",
        }, async ({ db }) => {
            await fn(db);
            await get().dbBroadcastSync();
        });
    },
});


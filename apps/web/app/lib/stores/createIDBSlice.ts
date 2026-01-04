import { openDB, type IDBPDatabase } from "idb";
import { type StateCreator } from "zustand";

export interface IDBStore<TData = any> {
    dbIdle: boolean;
    db: IDBPDatabase | null;
    dbSyncChannel: BroadcastChannel | null;
    data: TData[];
    dbInitialize: () => Promise<void>;
    dbUninitialize: () => Promise<void>;
    dbSync: () => Promise<void>;
    dbBroadcastSync: () => void;
    dbRun: <T>(fn: (store: IDBStore) => Promise<T>) => Promise<T>;
    dbMutate: (fn: (db: IDBPDatabase) => void) => Promise<void>;
};

export interface CreateIDBSliceOptions {
    databaseName: string;
    storeName: string;
};

export const createIDBSlice = <TData>({
    databaseName,
    storeName,
}: CreateIDBSliceOptions): StateCreator<IDBStore<TData>> => (set, get) => ({
    dbIdle: true,
    db: null,
    dbSyncChannel: null,
    data: [] as TData[],
    dbRun: async <T>(fn: (store: IDBStore) => Promise<T>): Promise<T> => {
        set({ dbIdle: false });
        try {
            return await fn(get());
        } finally {
            set({ dbIdle: true });
        }
    },
    dbInitialize: () =>
        get().dbRun(async () => {
            const db = await openDB(databaseName, 4, {
                upgrade(db) {
                    db.createObjectStore(storeName, {
                        keyPath: "id",
                        autoIncrement: true,
                    });
                },
            });

            const dbSyncChannel = new BroadcastChannel(`${databaseName}-channel`);

            dbSyncChannel.addEventListener("message", async (msg) => {
                if (msg.data === "update") {
                    await get().dbSync();
                }
            });

            set({ db, dbSyncChannel });

            get().dbSync();
        }),
    dbUninitialize: async () => {
        get().dbSyncChannel?.close();
        get().db?.close();
        set({ db: null, dbSyncChannel: null, data: [] });
    },
    dbSync: async () => {
        await get().dbRun(async () => {
            const data: TData[] = await get().db?.getAll(storeName) || [];
            set({ data });
        });
    },
    dbBroadcastSync: () => {
        get().dbSyncChannel?.postMessage("update");
    },
    dbMutate: async (fn: (db: IDBPDatabase) => void) => {
        await get().dbRun(async ({ db }) => {
            fn(db!);
            get().dbBroadcastSync();
        });
        await get().dbSync();
    },
});


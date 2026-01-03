import { openDB, type IDBPDatabase } from "idb";
import { create } from "zustand";

export interface IDBStore<TData = any> {
    idle: boolean;
    db: IDBPDatabase | null;
    channel: BroadcastChannel | null;
    data: TData[];
    init: () => Promise<void>;
    sync: () => Promise<void>;
    broadcastSync: () => void;
    run: <T>(fn: (store: IDBStore) => Promise<T>) => Promise<T>;
    mutate: (fn: (db: IDBPDatabase) => void) => Promise<void>;
};

export const createIDBStore = <TData>({
    databaseName,
    storeName,
}: {
    databaseName: string;
    storeName: string;
}) => {
    return create<IDBStore<TData>>()((set, get) => ({
        idle: true,
        db: null,
        channel: null,
        data: [] as TData[],
        run: async <T>(fn: (store: IDBStore) => Promise<T>): Promise<T> => {
            set({ idle: false });
            try {
                return await fn(get());
            } finally {
                set({ idle: true });
            }
        },
        init: () =>
            get().run(async () => {
                const db = await openDB(databaseName, 4, {
                    upgrade(db) {
                        db.createObjectStore(storeName, {
                            keyPath: "id",
                            autoIncrement: true,
                        });
                    },
                });
                
                const channel = new BroadcastChannel(`${databaseName}-channel`);
                
                channel.addEventListener("message", async (msg) => {
                    if (msg.data === "update") {
                        await get().sync();
                    }
                });

                set({ db, channel });

                get().sync();
            }),
        sync: async () => {
            await get().run(async () => {
                const data: TData[] = await get().db?.getAll(storeName) || [];
                set({ data });
            });
        },
        broadcastSync: () => {
            get().channel?.postMessage("update");
        },
        mutate: async (fn: (db: IDBPDatabase) => void) => {
            await get().run(async ({ db }) => {
                fn(db!);
                get().broadcastSync();
            });
            await get().sync();
        },
    }));
};

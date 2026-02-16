import type { IDatabase } from "./interface";
import { config } from "../config/env";
import MemoryDatabaseImpl from "./adapters/memory";
import PostgresDatabaseImpl from "./adapters/postgres";

const createDatabaseImpl = (): IDatabase => {
    const klass = ({
        memory: MemoryDatabaseImpl,
        postgres: PostgresDatabaseImpl,
    } as Partial<Record<typeof config["DB_TYPE"], new () => IDatabase>>)[config.DB_TYPE];

    if(!klass) {
        console.log(`Unsupported DB_TYPE: ${config.DB_TYPE}`);
        console.log(`Falling back to in-memory database.`);
        return new MemoryDatabaseImpl();
    }

    return new klass();
};

export const db = createDatabaseImpl();

db.init?.()
    .then(() => console.log("Database initialized"))
    .catch((err) => {
        console.error("Failed to initialize database:", err);
        process.exit(1);
    });

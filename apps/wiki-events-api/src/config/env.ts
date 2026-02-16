import z from "zod";

export const config = z.object({
    // Server settings
    PORT: z.string().transform(Number).default(3000),

    // Database settings
    DB_TYPE: z.enum(["memory", "postgres", "sqlite", "mongodb"]).default("memory"),

    // Postgres settings
    POSTGRES_CONNECTION_STRING: z.string().default("postgresql://user:password@localhost:5432/events"),

    // SQLite settings
    SQLITE_FILE_PATH: z.string().default("./data/events.db"),

    // MongoDB settings
    MONGODB_URI: z.string().default("mongodb://localhost:27017/events"),
    MONGODB_DB_NAME: z.string().default("events"),

    // OAuth settings
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),
    DISCORD_CLIENT_ID: z.string().optional(),
    DISCORD_CLIENT_SECRET: z.string().optional(),
}).parse(process.env);

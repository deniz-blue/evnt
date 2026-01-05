import { config } from "../../config/env";
import type { CreateEventPatchRecord, CreateEventRecord, CreateFn, DeleteFn, EventPatchRecord, EventRecord, GetFn, IDatabase, UpdateFn } from "../interface";
import { Pool, type PoolClient } from "pg";

export default class PostgresDatabaseImpl implements IDatabase {
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            connectionString: config.POSTGRES_CONNECTION_STRING,
        });
    }

    async op<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
        const client = await this.pool.connect();
        try {
            return await fn(client);
        } finally {
            client.release();
        }
    }

    async init(): Promise<void> {
        await this.op(async (client) => {
            await client.query(`
                CREATE TABLE IF NOT EXISTS events (
                    id TEXT PRIMARY KEY,
                    data JSONB NOT NULL
                );
                CREATE TABLE IF NOT EXISTS event_patches (
                    id TEXT PRIMARY KEY,
                    event_id TEXT NOT NULL,
                    author_id TEXT NOT NULL,
                    patch JSONB NOT NULL,
                    timestamp BIGINT NOT NULL,
                    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
                );
            `);
        });
    }

    createEvent: CreateFn<CreateEventRecord, EventRecord> = (record) => this.op(async (client) => {
        const id = crypto.randomUUID();
        await client.query(
            `INSERT INTO events (id, data) VALUES ($1, $2)`,
            [id, JSON.stringify(record.data)]
        );
        return id;
    });

    getEvent: GetFn<EventRecord> = (id) => this.op(async (client) => {
        const res = await client.query(
            `SELECT id, data FROM events WHERE id = $1`,
            [id]
        );
        if (res.rows.length === 0) return null;
        const row = res.rows[0];
        return { id: row.id, data: row.data };
    });

    updateEvent: UpdateFn<EventRecord> = (event) => this.op(async (client) => {
        await client.query(
            `UPDATE events SET data = $2 WHERE id = $1`,
            [event.id, JSON.stringify(event.data)]
        );
    });

    deleteEvent: DeleteFn<EventRecord> = (id) => this.op(async (client) => {
        await client.query(
            `DELETE FROM events WHERE id = $1`,
            [id]
        );
    });

    async getEventData(id: string): Promise<EventRecord["data"] | null> {
        const event = await this.getEvent(id);
        return event ? event.data : null;
    }

    async updateEventData(id: string, data: EventRecord["data"]): Promise<void> {
        const event = await this.getEvent(id);
        if (event) {
            event.data = data;
            await this.updateEvent(event);
        }
    }

    createEventPatch: CreateFn<CreateEventPatchRecord, EventPatchRecord> = (patch) => this.op(async (client) => {
        const id = crypto.randomUUID();
        await client.query(
            `INSERT INTO event_patches (id, event_id, author_id, patch, timestamp) VALUES ($1, $2, $3, $4, $5)`,
            [id, patch.eventId, patch.authorId, JSON.stringify(patch.patch), patch.timestamp]
        );
        return id;
    })

    deleteEventPatch: DeleteFn<EventPatchRecord> = (id) => this.op(async (client) => {
        await client.query(
            `DELETE FROM event_patches WHERE id = $1`,
            [id]
        );
    });

    getEventPatch: GetFn<EventPatchRecord> = (id) => this.op(async (client) => {
        const res = await client.query(
            `SELECT id, event_id, author_id, patch, timestamp FROM event_patches WHERE id = $1`,
            [id]
        );
        if (res.rows.length === 0) return null;
        const row = res.rows[0];
        return {
            id: row.id,
            eventId: row.event_id,
            authorId: row.author_id,
            patch: row.patch,
            timestamp: row.timestamp,
        };
    });

    getEventPatches = (eventId: string) => this.op(async (client) => {
        const res = await client.query(
            `SELECT id, event_id, author_id, patch, timestamp FROM event_patches WHERE event_id = $1`,
            [eventId]
        );
        return res.rows.map(row => ({
            id: row.id,
            eventId: row.event_id,
            authorId: row.author_id,
            patch: row.patch,
            timestamp: row.timestamp,
        }));
    });

    updateEventPatch: UpdateFn<EventPatchRecord> = (patch) => this.op(async (client) => {
        await client.query(
            `UPDATE event_patches SET event_id = $2, author_id = $3, patch = $4, timestamp = $5 WHERE id = $1`,
            [patch.id, patch.eventId, patch.authorId, JSON.stringify(patch.patch), patch.timestamp]
        );
    });
};

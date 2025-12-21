import z from "zod";
import { EventActivityBaseSchema } from "./EventActivityBase";

export type EventActivity = z.infer<typeof EventActivitySchema>;
export const EventActivitySchema = EventActivityBaseSchema
    .extend({}) // No additional fields for now
    .meta({
        id: "EventActivity",
    });

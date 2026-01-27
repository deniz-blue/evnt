import z from "zod";
import { TranslationsSchema } from "../types/Translations";
import { VenueSchema } from "./venue/Venue";
import { EventInstanceSchema } from "./EventInstance";
import { EventComponentSchema } from "./components/EventComponent";
import { EventStatusSchema } from "./enums/EventStatus";

export const $ID = "https://raw.githubusercontent.com/deniz-blue/events-format/refs/heads/main/event-data.schema.json";

export type EventData = z.infer<typeof EventDataSchema>;
export const EventDataSchema = z.object({
    v: z.literal(0).meta({ description: "The version of the Event Data schema" }),
    id: z.string().optional(),
    name: TranslationsSchema.meta({ description: "The name of the event" }),
    description: TranslationsSchema.optional().meta({ description: "A short description of the event" }),
    status: EventStatusSchema.optional().meta({ description: "The status of the event" }),

    venues: VenueSchema.array().default([]).meta({ description: "The venues associated with this event" }),
    instances: EventInstanceSchema.array().default([]).meta({ description: "The instances of the event" }),
    components: EventComponentSchema.array().default([]).meta({ description: "Additional components of the event" }),
}).meta({
    id: "EventData",
    title: "Event Data",
    description: "An event",
    $id: $ID,
});

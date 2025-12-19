import z from "zod";
import { TranslationsSchema } from "../types/Translations";
import { VenueSchema } from "./venue/Venue";
import { EventInstanceSchema } from "./EventInstance";
import { EventComponentSchema } from "./components/EventComponent";

const $ID = "https://raw.githubusercontent.com/deniz-blue/events-format/refs/heads/main/event-data.schema.json";

export type EventData = z.infer<typeof EventDataSchema>;
export const EventDataSchema = z.object({
    v: z.literal(0),
    id: z.string().optional(),
    name: TranslationsSchema,
    description: TranslationsSchema.optional(),

    venues: VenueSchema.array(),
    instances: EventInstanceSchema.array(),
    components: EventComponentSchema.array().optional(),
}).meta({
    id: "EventData",
    $id: $ID,
});

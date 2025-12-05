import z from "zod";
import { TranslationsSchema } from "./types/Translations";
import { VenueSchema } from "./schemas/venue/Venue";
import { EventInstanceSchema } from "./schemas/EventInstance";

export type EventData = z.infer<typeof EventDataSchema>;
export const EventDataSchema = z.object({
    v: z.literal(0),
    id: z.string().optional(),
    name: TranslationsSchema,
    description: TranslationsSchema.optional(),

    venues: VenueSchema.array(),
    instances: EventInstanceSchema.array(),
})

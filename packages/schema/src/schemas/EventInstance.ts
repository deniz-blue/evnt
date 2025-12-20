import z from "zod";
import { PartialDateSchema } from "../types/PartialDate";

export type EventInstance = z.infer<typeof EventInstanceSchema>;
export const EventInstanceSchema = z.object({
    id: z.string().optional(),
    venueIds: z.string().array().meta({ description: "The IDs of the venues where this event instance takes place" }),
    start: PartialDateSchema.optional(),
    end: PartialDateSchema.optional(),
    
    // status
    // metadata
    // activities
    // organizers
}).meta({
    id: "EventInstance",
    title: "Event Instance",
    description: "A part of an event that can occur at a known or unknown date and/or time and a known or unknown place or places.",
});

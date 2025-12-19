import z from "zod";
import { PartialDateSchema } from "../types/PartialDate";

export type EventInstance = z.infer<typeof EventInstanceSchema>;
export const EventInstanceSchema = z.object({
    id: z.string().optional(),
    venueIds: z.string().array(),
    start: PartialDateSchema.optional(),
    end: PartialDateSchema.optional(),
    
    // status
    // metadata
    // activities
    // organizers
}).meta({ id: "EventInstance" });

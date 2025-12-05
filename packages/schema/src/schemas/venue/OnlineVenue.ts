import z from "zod";
import { VenueTypeSchema } from "./VenueType";
import { BaseVenueSchema } from "./BaseVenue";

export type OnlineVenue = z.infer<typeof OnlineVenueSchema>;
export const OnlineVenueSchema = BaseVenueSchema.extend({
    venueType: z.literal(VenueTypeSchema.enum.online),
    url: z.string().optional(),
})

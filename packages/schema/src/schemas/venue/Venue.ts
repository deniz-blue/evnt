import z from "zod";
import { PhysicalVenueSchema } from "./PhysicalVenue";
import { OnlineVenueSchema } from "./OnlineVenue";

export type Venue = z.infer<typeof VenueSchema>;
export const VenueSchema = z.discriminatedUnion("venueType", [
    PhysicalVenueSchema,
    OnlineVenueSchema,
]).meta({ id: "Venue" });

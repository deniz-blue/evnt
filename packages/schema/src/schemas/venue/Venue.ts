import z from "zod";
import { PhysicalVenueSchema } from "./PhysicalVenue";
import { OnlineVenueSchema } from "./OnlineVenue";
import { UnknownVenueSchema } from "./UnknownVenue";

export type Venue = z.infer<typeof VenueSchema>;
export const VenueSchema = z.discriminatedUnion("venueType", [
    PhysicalVenueSchema,
    OnlineVenueSchema,
	UnknownVenueSchema,
]).meta({ id: "Venue" });

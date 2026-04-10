import z from "zod";

export type VenueType = z.infer<typeof VenueTypeSchema>;
export const VenueTypeSchema = z.enum([
	"directory.evnt.venue.physical",
	"directory.evnt.venue.online",
	"directory.evnt.venue.unknown",
]).meta({ id: "VenueType" });

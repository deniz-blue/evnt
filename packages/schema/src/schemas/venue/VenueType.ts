import z from "zod";

export type VenueType = z.infer<typeof VenueTypeSchema>;
export const VenueTypeSchema = z.enum([
    "physical",
    "online",
]).meta({ id: "VenueType" });

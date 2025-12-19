import z from "zod";
import { TranslationsSchema } from "../../types/Translations";

export type BaseVenue = z.infer<typeof BaseVenueSchema>;
export const BaseVenueSchema = z.object({
    venueId: z.string(),
    venueName: TranslationsSchema,
}).meta({ id: "BaseVenue" });


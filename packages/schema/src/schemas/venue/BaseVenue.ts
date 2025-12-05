import z from "zod";
import { TranslationsSchema } from "../../types/Translations";

export const BaseVenueSchema = z.object({
    venueId: z.string(),
    venueName: TranslationsSchema,
})

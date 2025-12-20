import z from "zod";
import { TranslationsSchema } from "../../types/Translations";

export const BaseVenueSchema = z.object({
    venueId: z.string().meta({ description: "ID of the venue to be used in Event Instances" }),
    venueName: TranslationsSchema.meta({ description: "The name of the venue" }),
});

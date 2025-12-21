import z from "zod";
import { TranslationsSchema } from "../../types/Translations";

export type EventActivityBase = z.infer<typeof EventActivityBaseSchema>;
export const EventActivityBaseSchema = z.object({
    id: z.string().optional(),
    name: TranslationsSchema.meta({ description: "The name of the activity" }),
    description: TranslationsSchema.optional().meta({ description: "The description of the activity" }),
}).meta({
    id: "EventActivityBase",
});

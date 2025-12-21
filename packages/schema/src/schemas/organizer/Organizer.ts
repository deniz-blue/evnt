import z from "zod";
import { TranslationsSchema } from "../../types/Translations";

export type Organizer = z.infer<typeof OrganizerSchema>;
export const OrganizerSchema = z.object({
    id: z.string().optional(),
    name: TranslationsSchema.meta({ description: "The name of the organizer" }),
    avatarUrl: z.url().optional().meta({ description: "The URL of the organizer's avatar image" }),
}).meta({
    id: "Organizer",
});

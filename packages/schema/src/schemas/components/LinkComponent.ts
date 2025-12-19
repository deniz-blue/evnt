import z from "zod";
import { PartialDateSchema } from "../../types/PartialDate";
import { TranslationsSchema } from "../../types/Translations";

export type LinkComponent = z.infer<typeof LinkComponentSchema>;
export const LinkComponentSchema = z.object({
    url: z.string(),
    name: TranslationsSchema.optional(),
    description: TranslationsSchema.optional(),
    disabled: z.boolean(),
    opensAt: PartialDateSchema.optional(),
    closesAt: PartialDateSchema.optional(),
}).meta({ id: "LinkComponent" });

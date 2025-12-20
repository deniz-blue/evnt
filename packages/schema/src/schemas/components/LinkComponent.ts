import z from "zod";
import { PartialDateSchema } from "../../types/PartialDate";
import { TranslationsSchema } from "../../types/Translations";

export type LinkComponent = z.infer<typeof LinkComponentSchema>;
export const LinkComponentSchema = z.object({
    url: z.string().meta({ description: "The URL of the link" }),
    name: TranslationsSchema.optional().meta({ description: "The name of the link" }),
    description: TranslationsSchema.optional().meta({ description: "A description of the link" }),
    disabled: z.boolean().meta({ description: "Whether the link is disabled" }),
    opensAt: PartialDateSchema.optional().meta({ description: "The date and/or time when the link becomes active" }),
    closesAt: PartialDateSchema.optional().meta({ description: "The date and/or time when the link becomes inactive" }),
}).meta({ id: "LinkComponent" });

import { z } from "zod";

export type LanguageKey = z.infer<typeof LanguageKeySchema>;
export const LanguageKeySchema = z.string();

export type Translations = z.infer<typeof TranslationsSchema>;
export const TranslationsSchema = z.record(LanguageKeySchema, z.string().nullish())
    .meta({
        id: "Translations",
    })

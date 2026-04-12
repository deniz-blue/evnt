import { z } from "zod";
import type { Translations } from "@evnt/translations";

export type LanguageKey = z.infer<typeof LanguageKeySchema>;
export const LanguageKeySchema = z.string().meta({
	description: "BCP37 language code",
});

export const TranslationsSchema = z.record(LanguageKeySchema, z.string().optional())
	.meta({
		id: "Translations",
		description: "A multilingual string",
		default: {
			en: ""
		},
		examples: [
			{ en: "Example", tr: "Örnek", lt: "Pavyzdys" },
		],
		defaultSnippets: [
			{
				label: "Add English",
				body: { en: "$1" },
			},
			{
				label: "Add other language",
				body: { "$1": "$2" },
			}
		]
	}) satisfies z.ZodType<Translations>;

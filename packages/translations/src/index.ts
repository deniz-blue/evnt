export type Translations = {
	[languageCode: string]: string | undefined;
};

export class TranslationsUtil {
	/** Creates a translator function based on preferred languages */
	static createTranslator(preferredLanguages?: string[]) {
		return (t?: Translations | null) => this.translate(t, preferredLanguages);
	}

	/** Translates a translations object based on preferred languages */
	static translate(t?: Translations | null, preferredLanguages?: string[]): string {
		if (!t) return "";
		const langs = preferredLanguages || ["en"];
		for (const lang of langs) {
			if (lang && t[lang]) return t[lang]!;
		}
		return Object.values(t).find(v => typeof v === "string") || "";
	}

	/** Merges multiple translations objects into one */
	static merge(...translations: (Translations | undefined | null)[]): Translations {
		const result: Translations = {};
		for (const t of translations) {
			if (!t) continue;
			for (const [key, value] of Object.entries(t)) {
				result[key] = value;
			}
		}
		return result;
	}

	/** Checks if a translations object is empty */
	static isEmpty(t?: Translations | null): boolean {
		if (!t) return true;
		return Object.values(t).every((value) => !value || value.trim() === "");
	}

	/**
	 * Searches translations for a query and returns matched text.
	 * 
	 * @example
	 * const t = { en: "Hello World", fr: "Bonjour le monde" };
	 * UtilTranslations.search(t, "world");
	 * => { en: "Hello World" }
	 * 
	 * @param t Translations object to search
	 * @param query Search this substring
	 * @returns Translations object with single key or null if not found
	 */
	static search(t?: Translations | null, query: string = ""): Translations | null {
		if (!t) return null;
		for (const key of Object.keys(t)) {
			const value = t[key];
			if (!value) continue;
			if (value.toLocaleLowerCase(key).includes(query.toLocaleLowerCase(key))) {
				return { [key]: value };
			}
		}
		return null;
	}

	static languagesOf(t: Translations): string[] {
		return Object.keys(t).filter(key => !!t[key]) as string[];
	}

	static withTranslation(t: Translations, lang: string, value: string): Translations {
		return { ...t, [lang]: value };
	}
}

import type { Translations } from "../types/Translations";

export class UtilTranslations {
	static createTranslator(langs?: string | string[]) {
		return (t?: Translations | null) => this.translate(t, langs);
	};

	static translate(t?: Translations | null, langs?: string | string[]): string {
		if (!t) return "";
		let pref = Array.isArray(langs) ? langs : [langs || "en"];
		for (const lang of pref)
			if (lang && t[lang]) return t[lang]!;
		return Object.values(t).find(v => typeof v === "string") || "";
	};

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

	static isEmpty(t?: Translations | null): boolean {
		if (!t) return true;
		return Object.values(t).every((value) => !value || value.trim() === "");
	}

	/**
	 * Searches translations for a query and returns matched text.
	 * @param t Translations
	 * @param query Search query
	 * @returns Matched text
	 */
	static search(t?: Translations | null, query: string = ""): Translations | null {
		// TODO: fuzzy search
		// TODO: string normalize NFD
		// TODO: diacritic insensitive search
		// TODO: return indicies instead

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
}

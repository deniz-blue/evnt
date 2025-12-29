import type { Translations } from "../types/Translations";

export class UtilTranslations {
    static createTranslator(locale?: string) {
        return (t: Translations | undefined) => {
            if (!t) return "";
            return t[locale || "en"] || t["en"] || "";
        };
    };

    static translate(t: Translations | undefined, locale?: string): string {
        if (!t) return "";
        return t[locale || "en"] || t["en"] || "";
    };

    static merge(...translations: (Translations | undefined)[]): Translations {
        const result: Translations = {};
        for (const t of translations) {
            if (!t) continue;
            for (const [key, value] of Object.entries(t)) {
                result[key] = value;
            }
        }
        return result;
    }

    /**
     * Searches translations for a query and returns matched text.
     * @param t Translations
     * @param query Search query
     * @returns Matched text
     */
    static search(t?: Translations, query: string = ""): Translations | null {
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

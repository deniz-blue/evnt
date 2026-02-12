import type { LanguageKey } from "@evnt/schema";
import { trynull } from "./trynull";

export class UtilLanguageCode {
	static isValidLanguageCode(code: string): code is LanguageKey {
		return trynull(() => new Intl.Locale(code)) !== null;
	}

	static getNameIn(lang: LanguageKey, inLang: LanguageKey): string | null {
		return trynull(() => new Intl.DisplayNames(inLang, { type: "language" }).of(lang));
	}

	static getAutonym(lang: LanguageKey): string | null {
		return this.getNameIn(lang, lang);
	}

	static getEnglishName(lang: LanguageKey): string | null {
		return this.getNameIn(lang, "en");
	}

	static getLabel(lang: LanguageKey): string {
		const autonym = this.getAutonym(lang);
		const englishName = this.getEnglishName(lang);
		return [...new Set([autonym, englishName])].filter(Boolean).join(" / ") || lang;
	}
}

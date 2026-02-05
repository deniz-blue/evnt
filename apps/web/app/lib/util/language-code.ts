import type { LanguageKey } from "@evnt/schema";
import { trynull } from "./trynull";
import { UtilCountryCode } from "./country-code";

export class UtilLanguageCode {
	static isValidLanguageCode(code: string): code is LanguageKey {
		return trynull(() => new Intl.Locale(code)) !== null;
	}

	static toCountryCode(lang: LanguageKey): string | null {
		return trynull(() => new Intl.Locale(lang).maximize().region);
	}

	static toEmoji(lang: LanguageKey): string {
		if(lang === "en") return "🌐"; // Special case for English
		const countryCode = this.toCountryCode(lang);
		if (!countryCode) return "�";
		return UtilCountryCode.toEmoji(countryCode);
	}

	static getNameIn(lang: LanguageKey, inLang: LanguageKey): string | null {
		return trynull(() => new Intl.DisplayNames(inLang, { type: "language" }).of(lang));
	}

	static getLocalName(lang: LanguageKey): string | null {
		return this.getNameIn(lang, lang);
	}

	static getEnglishName(lang: LanguageKey): string | null {
		return this.getNameIn(lang, "en");
	}

	static getLabel(lang: LanguageKey): string {
		const localName = this.getLocalName(lang) || lang;
		const englishName = this.getEnglishName(lang) || lang;
		return `${localName} / ${englishName} (${lang})`;
	}
}

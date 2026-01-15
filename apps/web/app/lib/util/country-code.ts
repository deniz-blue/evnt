import { trynull } from "./trynull";

export class UtilCountryCode {
	static toEmoji(countryCode: string): string {
		const codePoints = countryCode
			.toUpperCase()
			.split("")
			.map(char => 127397 + char.charCodeAt(0));
		return String.fromCodePoint(...codePoints);
	}

	static getNameIn(countryCode: string, inLang: string): string | null {
		return trynull(() => new Intl.DisplayNames(inLang, { type: "region" }).of(countryCode));
	}

	static getLocalName(countryCode: string): string | null {
		return this.getNameIn(countryCode, countryCode);
	}

	static getEnglishName(countryCode: string): string | null {
		return this.getNameIn(countryCode, "en");
	}

	static getLabel(countryCode: string, language: string): string {
		const upper = countryCode.toUpperCase();
		const localizedName = this.getNameIn(upper, language);
		const internationalName = this.getEnglishName(upper);
		const localName = this.getLocalName(upper);

		return [...new Set([
			localizedName,
			internationalName,
			localName,
		].filter(Boolean))].join(" / ") + ` (${upper})`;
	}
}

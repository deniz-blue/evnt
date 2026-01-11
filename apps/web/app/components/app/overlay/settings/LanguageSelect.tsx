import type { LanguageKey } from "@evnt/schema";
import { Select } from "@mantine/core";
import languages from "../../../../resources/languages.json";
import { countryCodeToEmoji } from "../../../content/address/CountryFlag";

export const languageCodeToCountryCode = (lang: LanguageKey) => {
	try {
		const locale = new Intl.Locale(lang).maximize();
		return locale.region || null;
	} catch (e) {
		return null;
	}
};

export const languageCodeEmoji = (lang: LanguageKey) => {
	const countryCode = languageCodeToCountryCode(lang);
	if (!countryCode) return "�";
	return countryCodeToEmoji(countryCode);
};

export const languageLocalName = (lang: LanguageKey) => {
	try {
		return new Intl.DisplayNames(lang, { type: "language" }).of(lang);
	} catch (e) {
		return lang;
	}
};

export const languageEnglishName = (lang: LanguageKey) => {
	try {
		return new Intl.DisplayNames("en", { type: "language" }).of(lang);
	} catch (e) {
		return lang;
	}
};

export const languageLabel = (lang: LanguageKey) => {
	const localName = languageLocalName(lang);
	const englishName = languageEnglishName(lang);
	return `${localName} / ${englishName} (${lang})`;
}

export const LanguageSelect = ({
	value,
	onChange,
}: {
	value: LanguageKey;
	onChange: (value: LanguageKey) => void;
}) => {
	return (
		<Select
			value={value}
			onChange={v => v && onChange(v as LanguageKey)}
			data={languages.map(value => ({ value, label: languageLabel(value) }))}
			searchable
			leftSection={languageCodeEmoji(value)}
			renderOption={({ option, checked }) => {
				const emoji = languageCodeEmoji(option.value as LanguageKey);

				return (
					<span>
						{checked ? "✅" : ""} {emoji} {languageLabel(option.value as LanguageKey)}
					</span>
				);
			}}
			label="Language"
			placeholder="Select language"
		/>
	);
};

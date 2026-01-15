import type { LanguageKey } from "@evnt/schema";
import { Select } from "@mantine/core";
import languages from "../../../../lib/resources/languages.json";
import { UtilLanguageCode } from "../../../../lib/util/language-code";

export const LanguageSelect = ({
	value,
	onChange,
}: {
	value: LanguageKey;
	onChange: (value: LanguageKey) => void;
}) => {
	return (
		<Select
			value={value || "en"}
			onChange={v => onChange(v || "en")}
			data={languages.map(value => ({ value, label: UtilLanguageCode.getEnglishName(value) || value }))}
			searchable
			clearable={value !== "en"}
			leftSection={UtilLanguageCode.toEmoji(value)}
			renderOption={({ option, checked }) => {
				const emoji = UtilLanguageCode.toEmoji(option.value as LanguageKey);

				return (
					<span>
						{checked ? "✅" : ""} {emoji} {UtilLanguageCode.getLabel(option.value as LanguageKey)}
					</span>
				);
			}}
			label="Language"
			placeholder="Select language"
		/>
	);
};

import type { LanguageKey } from "@evnt/schema";
import { Anchor, Input, Select, Stack } from "@mantine/core";
import languages from "../../../../lib/resources/languages.json";
import { UtilLanguageCode } from "../../../../lib/util/language-code";
import { useState } from "react";
import { LanguageIcon } from "../../../content/LanguageIcon";

export const LanguageSelect = ({
	value,
	onChange,
}: {
	value: LanguageKey;
	onChange: (value: LanguageKey) => void;
}) => {
	const [searchValue, setSearchValue] = useState("");

	const navigatorLanguages = [...new Set(navigator.languages
		.map(lang => lang.split("-")[0] as LanguageKey)
		.filter((lang): lang is LanguageKey => lang !== null))];

	return (
		<Stack gap={4}>
			<Select
				value={value || "en"}
				onChange={v => onChange(v || "en")}
				data={languages.map(value => ({ value, label: UtilLanguageCode.getEnglishName(value) || value }))}
				searchable
				searchValue={searchValue}
				onSearchChange={setSearchValue}
				onFocus={() => setSearchValue("")}
				clearable={value !== "en"}
				leftSection={<LanguageIcon language={value} />}
				renderOption={({ option, checked }) => {
					return (
						<span>
							{checked ? "✅" : ""} <LanguageIcon language={option.value as LanguageKey} tooltipDisabled /> {UtilLanguageCode.getLabel(option.value as LanguageKey)}
						</span>
					);
				}}
				label="Language"
				description="Select content language"
			/>
			<Stack gap={0}>
				{navigatorLanguages.filter(lang => value !== lang).map(lang => (
					<Input.Description key={lang} style={{ cursor: "pointer" }} onClick={() => onChange(lang)}>
						Change to <Anchor
							component="button"
							type="button"
							onClick={() => {
								onChange(lang);
							}}
							inherit
						>
							{UtilLanguageCode.getLabel(lang)}
						</Anchor>
					</Input.Description>
				))}
			</Stack>
		</Stack>
	);
};

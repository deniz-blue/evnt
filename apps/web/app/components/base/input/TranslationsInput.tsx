import type { LanguageKey, Translations } from "@evnt/schema";
import { useLocaleStore, useTranslations } from "../../../stores/useLocaleStore";
import { Accordion, ActionIcon, CloseButton, Combobox, Group, Indicator, Popover, Stack, TextInput, type TextInputProps } from "@mantine/core";
import { useMemo, useRef, useState } from "react";
import { UtilLanguageCode } from "../../../lib/util/language-code";
import { useDisclosure } from "@mantine/hooks";

export interface TranslationsInputProps extends Pick<TextInputProps, "disabled" | "error" | "required" | "label" | "placeholder"> {
	value: Translations;
	onChange: (value: Translations) => void;
}

export const TranslationsInput = ({
	value,
	onChange,
	...props
}: TranslationsInputProps) => {
	const userLanguage = useLocaleStore((state) => state.language);
	const t = useTranslations();

	const inputRefs = useRef<Map<LanguageKey, HTMLInputElement>>(new Map());
	const [selectedLanguage, setSelectedLanguage] = useState(userLanguage);
	const [popoverOpened, { open, close }] = useDisclosure(false);
	const [newLang, setNewLang] = useState("");

	const filteredValue = useMemo(() => {
		return Object.fromEntries(Object.entries(value).filter((pair): pair is [LanguageKey, string] => typeof pair[1] == "string"));
	}, [value]);

	const listLanguages = useMemo(() => {
		const set = new Set<LanguageKey>(Object.keys(filteredValue));
		set.add(userLanguage);
		return Array.from(set);
	}, [filteredValue, userLanguage]);

	return (
		<Stack>
			<Popover
				opened={popoverOpened}
				onDismiss={close}
				width="target"
				position="bottom"
				closeOnClickOutside
				closeOnEscape
			>
				<Popover.Target>
					<TextInput
						{...props}
						value={value[selectedLanguage] || ""}
						onChange={(event) => {
							onChange({
								...value,
								[selectedLanguage]: event.currentTarget.value,
							});
						}}
						placeholder={t(filteredValue) || props.placeholder}
						rightSectionWidth="auto"
						rightSection={(
							<Group gap={4} pr={4} wrap="nowrap">
								<Indicator
									label={Object.keys(filteredValue).length}
									position="bottom-end"
									color="transparent"
									offset={4}
									styles={{ indicator: { pointerEvents: "none" } }}
									disabled={Object.keys(filteredValue).length <= 1}
								>
									<ActionIcon
										variant="subtle"
										color="gray"
										onClick={() => {
											setSelectedLanguage(prev => {
												const currentIndex = listLanguages.indexOf(prev);
												const nextIndex = (currentIndex + 1) % listLanguages.length;
												return listLanguages[nextIndex] || prev;
											});
										}}
									>
										{UtilLanguageCode.toEmoji(selectedLanguage)}
									</ActionIcon>
								</Indicator>
								<ActionIcon
									variant="subtle"
									color="gray"
									onClick={open}
								>
									<Accordion.Chevron style={{
										transform: popoverOpened ? "rotate(180deg)" : "rotate(0deg)",
										transition: "transform 150ms ease",
									}} />
								</ActionIcon>
							</Group>
						)}
					/>
				</Popover.Target>
				<Popover.Dropdown p={4}>
					<Stack gap={4}>
						{Object.entries(filteredValue).map(([lang, text]) => (
							<Group gap={4} key={lang}>
								<ActionIcon
									variant="transparent"
									component="span"
								>
									{UtilLanguageCode.toEmoji(lang)}
								</ActionIcon>
								<TextInput
									key={`input-${lang}`}
									value={text}
									onChange={e => onChange({ ...value, [lang]: e.currentTarget.value })}
									flex="1"
									rightSection={(
										<CloseButton
											onClick={() => onChange({ ...value, [lang]: undefined })}
										/>
									)}
									ref={(el) => {
										if (el) inputRefs.current.set(lang, el);
										return () => void inputRefs.current.delete(lang);
									}}
								/>
							</Group>
						))}
						<Group gap={4}>
							<TextInput
								placeholder="Lang."
								value={newLang}
								w="4rem"
								onChange={e => setNewLang(e.currentTarget.value)}
							/>
							<TextInput
								placeholder="Translation..."
								flex="1"
								disabled={!newLang || !!value[newLang as LanguageKey]}
								key={`input-${newLang}`}
								onFocus={() => {
									if (!newLang) return;

									if (typeof value[newLang as LanguageKey] !== "string") {
										onChange({ ...value, [newLang as LanguageKey]: "" });
									};

									setNewLang("");
									setTimeout(() => {
										inputRefs.current.get(newLang as LanguageKey)?.focus();
									}, 0);
								}}
								value=""
								onChange={() => { }} // react warning
							/>
						</Group>
					</Stack>
				</Popover.Dropdown>
			</Popover>
		</Stack>
	);
};

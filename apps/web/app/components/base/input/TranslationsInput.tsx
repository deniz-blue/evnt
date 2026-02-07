import type { LanguageKey, Translations } from "@evnt/schema";
import { useLocaleStore, useTranslations } from "../../../stores/useLocaleStore";
import { Accordion, ActionIcon, CloseButton, Combobox, Group, Indicator, Input, Popover, Stack, Text, TextInput, Tooltip, type TextInputProps } from "@mantine/core";
import { useMemo, useRef, useState } from "react";
import { UtilLanguageCode } from "../../../lib/util/language-code";
import { useDisclosure } from "@mantine/hooks";

export interface TranslationsInputProps extends Pick<TextInputProps, "disabled" | "error" | "required" | "label" | "placeholder" | "description"> {
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
						placeholder={t(filteredValue) || props.placeholder || "Translation..."}
						rightSectionWidth="auto"
						rightSection={(
							<Group gap={4} pr={4} wrap="nowrap">
								<Indicator
									label={Object.keys(filteredValue).length}
									position="bottom-end"
									color="transparent"
									offset={4}
									styles={{ indicator: { pointerEvents: "none" } }}
									disabled={Object.keys(filteredValue).length === 0 || (Object.keys(filteredValue).length === 1 && typeof filteredValue[selectedLanguage] === "string")}
								>
									<Tooltip label={UtilLanguageCode.getLabel(selectedLanguage)}>
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
									</Tooltip>
								</Indicator>
								<Tooltip label="Show all translations">
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
								</Tooltip>
							</Group>
						)}
					/>
				</Popover.Target>
				<Popover.Dropdown p={4}>
					<Stack gap={4}>
						{!Object.keys(filteredValue).length && (
							<Text size="xs" c="dimmed" ta="center">
								No translations yet. Add one using the inputs below.
							</Text>
						)}
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
									placeholder={t(filteredValue) || props.placeholder || "Translation..."}
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
						<Input.Description>
							Type the two-letter language code in Lang
						</Input.Description>
					</Stack>
				</Popover.Dropdown>
			</Popover>
		</Stack>
	);
};

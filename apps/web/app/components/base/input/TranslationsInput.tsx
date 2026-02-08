import type { LanguageKey, Translations } from "@evnt/schema";
import { useLocaleStore, useTranslations } from "../../../stores/useLocaleStore";
import { Accordion, ActionIcon, Box, CloseButton, Combobox, Group, Indicator, Input, Popover, Stack, Text, TextInput, Tooltip, type TextInputProps } from "@mantine/core";
import { useMemo, useRef, useState } from "react";
import { UtilLanguageCode } from "../../../lib/util/language-code";
import { useDisclosure } from "@mantine/hooks";
import { LanguageIcon } from "../../content/LanguageIcon";

export interface TranslationsInputProps extends Pick<TextInputProps, "disabled" | "error" | "required" | "label" | "placeholder" | "description"> {
	value: Translations;
	onChange: (value: Translations) => void;
	onDelete?: () => void;
}

export const TranslationsInput = ({
	value,
	onChange,
	onDelete,
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
				shadow="xl"
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
								<LanguageIcon
									language={selectedLanguage}
									onClick={() => {
										setSelectedLanguage(prev => {
											const currentIndex = listLanguages.indexOf(prev);
											const nextIndex = (currentIndex + 1) % listLanguages.length;
											return listLanguages[nextIndex] || prev;
										});
									}}
								/>
								<Tooltip label="Show all translations">
									<Indicator
										inline
										disabled={(Object.keys(filteredValue).length === 0 || (Object.keys(filteredValue).length === 1 && typeof filteredValue[selectedLanguage] === "string"))}
										size={16}
										label={(
											<Box>
												{Object.keys(filteredValue).length}
											</Box>
										)}
										style={{ opacity: 0.8 }}
										color="gray"
									>
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
									</Indicator>
								</Tooltip>
								{onDelete && (
									<Tooltip label="Remove value">
										<CloseButton onClick={onDelete} />
									</Tooltip>
								)}
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
						{Object.entries(filteredValue).sort(([a], [b]) => a.localeCompare(b)).map(([lang, text]) => (
							<Group gap={4} key={lang}>
								<LanguageIcon language={lang} />
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
							Type the IETF BCP 47 language code in Lang. (e.g. "en", "fr", "zh-CN")
						</Input.Description>
					</Stack>
				</Popover.Dropdown>
			</Popover>
		</Stack>
	);
};

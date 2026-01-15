import type { Translations } from "@evnt/schema";
import { useLocaleStore } from "../../../stores/useLocaleStore";
import { Stack, TextInput, type TextInputProps } from "@mantine/core";

export interface TranslationsInputProps extends Pick<TextInputProps, "disabled" | "error" | "required" | "label"> {
	value: Translations;
	onChange: (value: Translations) => void;
}

export const TranslationsInput = ({
	value,
	onChange,
	...props
}: TranslationsInputProps) => {
	const userLanguage = useLocaleStore((state) => state.language);

	return (
		<Stack>
			<TextInput
				readOnly
				{...props}
			/>
		</Stack>
	);
};

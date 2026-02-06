import { CloseButton, TextInput, type TextInputProps } from "@mantine/core";

export const ClearableTextInput = ({
	value,
	onChange,
	onDelete,
	...props
}: Omit<TextInputProps, "value" | "onChange"> & {
	value: string;
	onChange: (value: string) => void;
	onDelete?: () => void;
}) => {
	return (
		<TextInput
			value={value}
			onChange={(event) => onChange(event.currentTarget.value)}
			rightSection={<CloseButton onClick={onDelete} />}
			{...props}
		/>
	);
};

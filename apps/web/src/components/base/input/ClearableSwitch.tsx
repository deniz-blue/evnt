import { CloseButton, Group, Switch, TextInput, Tooltip, type SwitchProps, type TextInputProps } from "@mantine/core";

export const ClearableSwitch = ({
	value,
	onChange,
	onDelete,
	...props
}: Omit<SwitchProps, "value" | "onChange"> & {
	value: boolean;
	onChange: (value: boolean) => void;
	onDelete?: () => void;
}) => {
	return (
		<Group gap={4}>
			{onDelete && (
				<Tooltip label="Remove value">
					<CloseButton onClick={onDelete} />
				</Tooltip>
			)}
			<Switch
				checked={value}
				onChange={(event) => onChange(event.currentTarget.checked)}
				{...props}
			/>
		</Group>
	);
};

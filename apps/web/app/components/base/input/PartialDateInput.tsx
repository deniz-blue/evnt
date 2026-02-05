import type { PartialDate } from "@evnt/schema";
import { Stack, TextInput } from "@mantine/core";

export const PartialDateInput = ({
	value,
	onChange,
}: {
	value: PartialDate;
	onChange: (value: PartialDate) => void;
}) => {
	return (
		<Stack>
			<TextInput
				value={value}
				onChange={(event) => onChange(event.currentTarget.value as PartialDate)}
			/>
		</Stack>
	);
};

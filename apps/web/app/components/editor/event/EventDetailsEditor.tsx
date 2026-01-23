import { Stack } from "@mantine/core";
import { useEventForm } from "./event-form-context";
import { TranslationsInput } from "../../base/input/TranslationsInput";

export const EventDetailsEditor = () => {
	const form = useEventForm();

	return (
		<Stack>
			<TranslationsInput
				value={form.getValues().name}
				onChange={(value) => form.setFieldValue("name", value)}
				label="Event Name"
				required
			/>
		</Stack>
	)
};

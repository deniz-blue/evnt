import { Select, Stack } from "@mantine/core";

export const TimezoneSelect = () => {
	return (
		<Stack>
			<Select
				label="Timezone (TODO)"
				placeholder="Select your timezone"
				data={Intl.supportedValuesOf('timeZone').map(tz => ({ value: tz, label: tz }))}
				readOnly
				searchable
			/>
		</Stack>
	);
};

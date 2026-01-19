import { Select, Stack } from "@mantine/core";
import { useLocaleStore } from "../../../../stores/useLocaleStore";

export const TimezoneSelect = () => {
	const timezone = useLocaleStore(store => store.timezone);

	return (
		<Stack>
			<Select
				label="Timezone (TODO)"
				placeholder="Select your timezone"
				data={Intl.supportedValuesOf('timeZone').map(tz => ({ value: tz, label: tz }))}
				searchable
				value={timezone}
				onChange={(value) => {
					if (value) {
						useLocaleStore.setState({ timezone: value });
					}
				}}
			/>
		</Stack>
	);
};

import { Select, Stack } from "@mantine/core";
import { useLocaleStore } from "../../../../stores/useLocaleStore";
import { useState } from "react";

export const TimezoneSelect = () => {
	const [searchValue, setSearchValue] = useState("");
	const timezone = useLocaleStore(store => store.timezone);

	return (
		<Stack>
			<Select
				label="Timezone (TODO)"
				placeholder="Select your timezone"
				data={Intl.supportedValuesOf('timeZone').map(tz => ({ value: tz, label: tz }))}
				searchable
				searchValue={searchValue}
				onSearchChange={setSearchValue}
				onFocus={() => setSearchValue("")}
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

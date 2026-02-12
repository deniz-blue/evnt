import { Anchor, Input, Select, Stack } from "@mantine/core";
import { useLocaleStore } from "../../../../stores/useLocaleStore";
import { useState } from "react";
import { trynull } from "../../../../lib/util/trynull";

export const TimezoneSelect = () => {
	const [searchValue, setSearchValue] = useState("");
	const timezone = useLocaleStore(store => store.timezone);

	const clientTimezone = trynull(() => new Intl.DateTimeFormat().resolvedOptions().timeZone);

	return (
		<Stack gap={4}>
			<Select
				label="Timezone"
				description="Select your timezone"
				data={Intl.supportedValuesOf('timeZone').filter(x => !x.startsWith("Etc/")).map(tz => ({ value: tz, label: tz }))}
				searchable
				clearable={timezone !== "UTC"}
				searchValue={searchValue}
				onSearchChange={setSearchValue}
				onFocus={() => setSearchValue("")}
				value={timezone ?? "UTC"}
				onChange={(value) => {
					useLocaleStore.setState({ timezone: value ?? "UTC" });
				}}
			/>
			{(clientTimezone && timezone !== clientTimezone) && (
				<Input.Description>
					Change to <Anchor
						component="button"
						type="button"
						onClick={() => {
							useLocaleStore.setState({ timezone: clientTimezone });
						}}
						inherit
					>
						{clientTimezone}
					</Anchor>
				</Input.Description>
			)}
		</Stack>
	);
};

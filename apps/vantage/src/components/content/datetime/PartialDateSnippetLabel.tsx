import type { PartialDate } from "@evnt/schema";
import { UtilPartialDate } from "@evnt/schema/utils";
import { Text } from "@mantine/core";
import { useLocaleStore } from "../../../stores/useLocaleStore";

export const PartialDateSnippetLabel = ({
	value,
	timezone,
	language,
}: {
	value: PartialDate;
	timezone?: string;
	language?: string;
}) => {
	const userLanguage = useLocaleStore(store => store.language);
	const userTimezone = useLocaleStore(store => store.timezone);

	const text = UtilPartialDate.toIntlString(value, {
		locale: language || userLanguage,
		timezone: timezone || userTimezone,
	});

	return (
		<Text
			component="time"
			dateTime={value}
			inline
			inherit
		>
			{text}
		</Text>
	)
};

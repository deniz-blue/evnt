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

	const fmt = new Intl.DateTimeFormat(language || userLanguage, {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: UtilPartialDate.hasTime(value) ? "numeric" : undefined,
		minute: UtilPartialDate.hasTime(value) ? "numeric" : undefined,
		hour12: false,
		timeZone: timezone || userTimezone,
	});

	const parts = fmt.formatToParts(UtilPartialDate.toLowDate(value));

	return (
		<Text
			component="time"
			dateTime={value}
			aria-label={parts.map(p => p.value).join("")}
			inline
			inherit
		>
			{parts.map((p, i) => (
				<Text key={i} span inline inherit c={(p.type === "literal" && p.value.trim() !== ":") ? "dimmed" : undefined}>
					{p.value}
				</Text>
			))}
		</Text>
	)
};

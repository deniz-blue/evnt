import { Text, Tooltip } from "@mantine/core";
import { useMemo } from "react";
import { useLocaleStore } from "../../../stores/useLocaleStore";

export const countryCodeToEmoji = (countryCode: string) => {
	const upper = countryCode.toUpperCase();
	return String.fromCodePoint(...upper
		.split("")
		.map(c => 127397 + c.charCodeAt(0)));
};

export const countryCodeLabel = (countryCode: string, language: string) => {
	try {
		const upper = countryCode.toUpperCase();
		const internationalName = new Intl.DisplayNames("en", { type: "region" }).of(upper);
		const localizedName = new Intl.DisplayNames(language, { type: "region" }).of(upper);
		const localName = new Intl.DisplayNames(upper, { type: "region" }).of(upper);

		return [...new Set([
			internationalName,
			localizedName,
			localName,
			upper,
		])].join(" / ");
	} catch (e) {
		return "";
	}
};

export const CountryFlag = ({ countryCode }: { countryCode: string }) => {
	const language = useLocaleStore(store => store.language);
	const upper = countryCode.toUpperCase();

	const tooltip = useMemo(() => {
		return countryCodeLabel(upper, language);
	}, []);

	return (
		<Tooltip label={tooltip} disabled={!tooltip}>
			<Text span inline inherit aria-label={tooltip} style={{ cursor: "default" }}>
				{countryCodeToEmoji(upper)}
			</Text>
		</Tooltip>
	);
};

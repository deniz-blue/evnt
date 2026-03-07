import { Text, Tooltip } from "@mantine/core";
import { useMemo } from "react";
import { useLocaleStore } from "../../../stores/useLocaleStore";
import { UtilCountryCode } from "../../../lib/util/country-code";

export const CountryFlag = ({ countryCode }: { countryCode: string }) => {
	const userLanguage = useLocaleStore(store => store.language);

	const tooltip = useMemo(() => {
		return UtilCountryCode.getLabel(countryCode, userLanguage);
	}, [userLanguage, countryCode]);

	return (
		<Tooltip label={tooltip} disabled={!tooltip}>
			<Text
				span
				inline
				inherit
				aria-label={UtilCountryCode.getNameIn(countryCode, userLanguage) ?? countryCode}
				style={{ cursor: "default" }}
			>
				{UtilCountryCode.toEmoji(countryCode)}
			</Text>
		</Tooltip>
	);
};

import { Tooltip } from "@mantine/core";
import { useLocale } from "../../../hooks/useLocale";

export const CountryFlag = ({ countryCode }: { countryCode: string }) => {
    const locale = useLocale();
    const upper = countryCode.toUpperCase();

    return (
        <Tooltip label={Intl.DisplayNames
            ? new Intl.DisplayNames(locale, { type: "region" }).of(upper)
            : upper}
        >
            <span>
                {String.fromCodePoint(...upper
                    .split("")
                    .map(c => 127397 + c.charCodeAt(0)))}
            </span>
        </Tooltip>
    );
};

import type { PartialDate } from "@evnt/schema";
import { UtilPartialDate } from "@evnt/schema/utils";
import { Text } from "@mantine/core";
import { useLocaleStore } from "../../../stores/useLocaleStore";

export const PartialDateSnippetLabel = ({ value }: { value: PartialDate }) => {
	const language = useLocaleStore(store => store.language);
	const timezone = useLocaleStore(store => store.timezone);

    return (
        <Text span inline inherit>
            {UtilPartialDate.toIntlString(value, {
				locale: language,
				timezone,
			})}
        </Text>
    )
};

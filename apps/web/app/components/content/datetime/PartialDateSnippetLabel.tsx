import type { PartialDate } from "@evnt/schema";
import { UtilPartialDate } from "@evnt/schema/utils";
import { Text } from "@mantine/core";
import { useLocaleStore } from "../../../stores/useLocaleStore";

export const PartialDateSnippetLabel = ({ value }: { value: PartialDate }) => {
	const language = useLocaleStore(store => store.language);

    return (
        <Text span inline>
            {UtilPartialDate.toIntlString(value, {
				locale: language,
			})}
        </Text>
    )
};

import type { Range } from "@evnt/pretty";
import type { PartialDate } from "@evnt/schema";
import { UtilPartialDate, UtilPartialDateRange } from "@evnt/schema/utils";
import { Text, Tooltip } from "@mantine/core";
import { useLocaleStore } from "../../../stores/useLocaleStore";

export const PartialDateRangeSnippetLabel = ({ value }: { value: Range<PartialDate> }) => {
    const language = useLocaleStore(store => store.language);

    const startParts = value.start.split(/\D/);
    const endParts = value.end.split(/\D/);

    const isSameYear = startParts[0] === endParts[0];
    const isSameMonth = isSameYear && startParts[1] === endParts[1];
    const isSameDay = isSameMonth && startParts[2] === endParts[2];
    const isSameTime = UtilPartialDateRange.isSameTime(value);

    return (
        <Tooltip label={``}>
            <Text span inline inherit>
                {new Intl.DateTimeFormat(language, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }).formatRange(UtilPartialDate.toDate(value.start), UtilPartialDate.toDate(value.end))}
            </Text>
        </Tooltip>
    )
};

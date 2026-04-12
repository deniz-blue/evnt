import type { PartialDate as PartialDateParts } from "@evnt/partial-date";
import { UtilPartialDate } from "~/lib/util/schema-utils";
import { ScrollArea, Stack } from "@mantine/core";
import { DatePicker, MonthLevel, MonthPicker } from "@mantine/dates";

export interface CalendarMobileMonthProps {
	month: PartialDateParts.YearMonth;
	setMonth: (month: PartialDateParts.YearMonth) => void;
	day: PartialDateParts.YearMonthDay;
	setDay: (day: PartialDateParts.YearMonthDay) => void;
	renderDay: (props: { day: PartialDateParts.YearMonthDay }) => React.ReactNode;
	renderDayButton?: (props: { day: PartialDateParts.YearMonthDay }) => React.ReactNode;
}

export const CalendarMobileMonth = ({
	month,
	setMonth,
	day,
	setDay,
	renderDay,
	renderDayButton,
}: CalendarMobileMonthProps) => {
	return (
		<Stack w="100%" h="100%" gap={0} align="center">
			<DatePicker
				date={month}
				value={day}
				onDateChange={(date) => setMonth(UtilPartialDate.asMonth(date as any))}
				onChange={(date) => setDay(UtilPartialDate.asDay(date as any))}
				renderDay={(day) => renderDayButton?.({ day: day as PartialDateParts.YearMonthDay }) ?? null}
				level="month"
			/>
			<ScrollArea w="100%">
				<Stack w="100%" h="100%" gap={0}>
					{renderDay({ day })}
				</Stack>
			</ScrollArea>
		</Stack>
	);
};

import type { PartialDate } from "@evnt/schema";
import { UtilPartialDate } from "@evnt/schema/utils";
import { ScrollArea, Stack } from "@mantine/core";
import { DatePicker, MonthLevel, MonthPicker } from "@mantine/dates";

export interface CalendarMobileMonthProps {
	month: PartialDate.Month;
	setMonth: (month: PartialDate.Month) => void;
	day: PartialDate.Day;
	setDay: (day: PartialDate.Day) => void;
	renderDay: (props: { day: PartialDate.Day }) => React.ReactNode;
	renderDayButton?: (props: { day: PartialDate.Day }) => React.ReactNode;
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
				renderDay={(day) => renderDayButton?.({ day: day as PartialDate.Day }) ?? null}
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

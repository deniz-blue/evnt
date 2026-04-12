import type { PartialDate as PartialDateParts } from "@evnt/partial-date";
import { UtilPartialDate } from "~/lib/util/schema-utils";
import { Box, Indicator, Stack } from "@mantine/core";
import { useState } from "react";
import { useLocaleStore } from "../../stores/useLocaleStore";
import { useCacheEventsStore } from "../../lib/cache/useCacheEventsStore";
import { useShallow } from "zustand/shallow";
import { useEventQueries } from "../../db/useEventQuery";
import { EventCard, type EventCardProps } from "../../components/content/event/card/EventCard";
import { createFileRoute } from "@tanstack/react-router";
import { ResolvedEventProvider } from "../../components/content/event/event-envelope-context";
import { CalendarMonth } from "../../components/calendar/CalendarMonth";
import { CalendarMobileMonth } from "../../components/calendar/CalendarMobileMonth";
import { Day } from "@mantine/dates";

export const Route = createFileRoute("/_layout/calendar")({
	component: CalendarPage,
	staticData: {
		spaceless: true,
	},
})

export default function CalendarPage() {
	const h = "calc(100svh - var(--app-shell-header-height, 0px) - 2 * var(--app-shell-padding) - var(--safe-area-inset-top) - var(--safe-area-inset-bottom))";

	const [month, setMonth] = useState<PartialDateParts.YearMonth>(UtilPartialDate.asMonth(UtilPartialDate.today()));
	const [day, setDay] = useState<PartialDateParts.YearMonthDay>(UtilPartialDate.asDay(UtilPartialDate.today()));

	let breakpoint = "xs";

	return null;

	return (
		<Stack
			h={h}
			mah={h}
			align="center"
			justify="center"
		>
			<Box visibleFrom={breakpoint} w="100%" h="100%">
				<CalendarMonth
					month={UtilPartialDate.asMonth(month)}
					setMonth={(m) => setMonth(m)}
					renderDay={({ day }) => <DayCard day={day} variant="inline" />}
				/>
			</Box>
			<Box hiddenFrom={breakpoint} w="100%" h="100%">
				<CalendarMobileMonth
					month={UtilPartialDate.asMonth(month)}
					setMonth={(m) => setMonth(m)}
					day={UtilPartialDate.asDay(day)}
					setDay={(d) => setDay(d)}
					renderDay={({ day }) => <DayCard
						day={day}
						variant="card"
					/>}
					renderDayButton={DayButton}
				/>
			</Box>
		</Stack>
	)
};

export const DayButton = ({
	day,
}: {
	day: PartialDateParts.YearMonthDay;
}) => {
	const sources = useCacheEventsStore(
		useShallow(store => store.cache.byDay[day] ?? [])
	);

	return (
		<Indicator
			label={sources.length}
			size={16}
			offset={4}
			disabled={sources.length === 0}
		>
			<Day
				component="div"
				date={day}
			/>
		</Indicator>
	);
};

export const DayCard = ({
	day,
	variant,
}: {
	day: PartialDateParts.YearMonthDay;
	variant?: EventCardProps["variant"];
}) => {
	const sources = useCacheEventsStore(
		useShallow(store => store.cache.byDay[day] ?? [])
	);

	const queries = useEventQueries(sources);

	return (
		<Stack gap={0}>
			{queries.map(({ query, source }, index) => (
				<ResolvedEventProvider
					key={index}
					value={query.data ?? { data: null }}
				>
					<EventCard
						variant={variant}
						source={source}
						loading={query.isFetching}
					/>
				</ResolvedEventProvider>
			))}
		</Stack>
	);
};

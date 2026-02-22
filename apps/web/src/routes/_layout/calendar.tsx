import type { PartialDate } from "@evnt/schema";
import { UtilPartialDate } from "@evnt/schema/utils";
import { ActionIcon, Box, Group, Overlay, Paper, ScrollArea, SimpleGrid, Stack, Text, Tooltip } from "@mantine/core";
import { getMonthDays } from "@mantine/dates";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { useState } from "react";
import { useLocaleStore } from "../../stores/useLocaleStore";
import { useCacheEventsStore } from "../../lib/cache/useCacheEventsStore";
import { useShallow } from "zustand/shallow";
import { useEventQueries } from "../../db/useEventQuery";
import { EventCard } from "../../components/content/event/EventCard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/calendar")({
	component: CalendarPage,
	staticData: {
		spaceless: true,
	},
})

export default function CalendarPage() {
	const [date, setDate] = useState<PartialDate>(UtilPartialDate.today());
	const userLanguage = useLocaleStore(store => store.language);

	const dates = getMonthDays({
		month: date,
		firstDayOfWeek: 1,
		consistentWeeks: true,
	}) as PartialDate.Day[][];

	const h = "calc(100svh - var(--app-shell-header-height, 0px) - 2 * var(--app-shell-padding) - var(--safe-area-inset-top) - var(--safe-area-inset-bottom))";

	return (
		<Stack
			h={h}
			mah={h}
			align="center"
			justify="center"
		>
			<Stack w="100%" h="100%" gap={0}>
				<Paper p="xs" withBorder w="100%" radius={0}>
					<Group justify="space-between">
						<Group>
							<Box>
								{new Date(date).toLocaleString("default", { month: "long", year: "numeric" })}
							</Box>
						</Group>
						<Group gap={4}>
							{[-1, +1].map(dir => (
								<Tooltip label={dir === -1 ? "Previous month" : "Next month"} key={dir}>
									<ActionIcon
										size="input-sm"
										color="gray"
										onClick={() => {
											const newDate = UtilPartialDate.toLowDate(date);
											newDate.setMonth(newDate.getMonth() + dir);
											setDate(UtilPartialDate.fromDate(newDate));
										}}
									>
										{dir === -1 ? <IconArrowLeft /> : <IconArrowRight />}
									</ActionIcon>
								</Tooltip>
							))}
						</Group>
					</Group>
				</Paper>
				<SimpleGrid cols={7} spacing={0}>
					{[...Array(7).keys()].map((d) => (
						<Paper withBorder radius={0} key={d}>
							<Text ta="center" fw={500} c="dimmed">
								{new Intl.DateTimeFormat(userLanguage, { weekday: "short" }).format(new Date(2021, 0, d + 4))}
							</Text>
						</Paper>
					))}
				</SimpleGrid>
				<SimpleGrid
					cols={7}
					spacing={0}
					verticalSpacing={0}
					w="100%"
					style={{
						flex: 1,
						display: "grid",
						gridTemplateRows: "repeat(6, 1fr)",
						minHeight: 0,
					}}
				>
					{dates.map(row => (
						row.map(day => (
							<Paper
								withBorder
								radius={0}
								w="100%"
								style={{
									overflow: "clip",
									minHeight: 0,
									display: "flex",
								}}
								pos="relative"
							>
								<DayCard month={date.slice(0, 7) as PartialDate.Month} day={day} />
							</Paper>
						))
					))}
				</SimpleGrid>
			</Stack>
		</Stack>
	)
};

export const DayCard = ({
	month,
	day
}: {
	month: PartialDate.Month;
	day: PartialDate.Day;
}) => {
	const isToday = UtilPartialDate.today() === day;

	const sources = useCacheEventsStore(
		useShallow(store => store.cache.byDay[day] ?? [])
	);

	const queries = useEventQueries(sources);

	return (
		<Stack gap={0} w="100%" h="100%" align="center">
			<Text
				ta="center"
				c={month !== day.slice(0, 7) ? "dimmed" : isToday ? "blue" : undefined}
				fz="xs"
				fw="bold"
				span
			>
				{day.slice(-2)}
				{sources.length > 0 && (
					<Text
						span
						c="dimmed"
						fz="xs"
						ml={4}
						children={`(${sources.length})`}
					/>
				)}
			</Text>
			<ScrollArea h="100%" mah="100%" w="100%" scrollbars="y">
				<Stack gap={0}>
					{queries.map(({ query, source }, index) => (
						<EventCard
							key={index}
							variant="inline"
							source={source}
							loading={query.isFetching}
							err={query.data?.err}
							rev={query.data?.rev}
							data={query.data?.draft ?? query.data?.data ?? null}
							isDraft={!!query.data?.draft}
						/>
					))}
				</Stack>
			</ScrollArea>
		</Stack>
	)
};

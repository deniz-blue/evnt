import type { PartialDate } from "@evnt/schema";
import { UtilPartialDate } from "@evnt/schema/utils";
import { ActionIcon, Box, Group, Overlay, Paper, ScrollArea, SimpleGrid, Stack, Text, Tooltip } from "@mantine/core";
import { getMonthDays } from "@mantine/dates";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { useState } from "react";
import { useLocaleStore } from "../stores/useLocaleStore";
import { useCacheEventsStore } from "../lib/cache/useCacheEventsStore";
import { useShallow } from "zustand/shallow";
import { useEventQueries } from "../db/useEventQuery";
import { EventCard } from "../components/content/event/EventCard";
import { EventContextMenu } from "../components/content/event/EventContextMenu";

export default function CalendarPage() {
	const [date, setDate] = useState<PartialDate>(UtilPartialDate.today());
	const userLanguage = useLocaleStore(store => store.language);

	const dates = getMonthDays({
		month: date,
		firstDayOfWeek: 1,
		consistentWeeks: true,
	}) as PartialDate.Day[][];

	const h = "calc(100svh - var(--app-shell-header-height, 0px) - 2 * var(--app-shell-padding) - var(--safe-area-inset-bottom) - var(--safe-area-inset-bottom))";

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
								{new Intl.DateTimeFormat(userLanguage, { weekday: "short" }).format(new Date(2021, 0, d + 3))}
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
						row.map(date => (
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
								<Overlay
									style={{ pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center" }}
									center
									backgroundOpacity={0}
									c="white"
									opacity={0.1}
									zIndex={5}
								>
									<svg width="100%" height="100%">
										<text
											x="50%"
											y="50%"
											textAnchor="middle"
											fontSize="30"
											fill="currentColor"
											dominantBaseline="middle"
										>
											{date.slice(-2)}
										</text>
									</svg>
								</Overlay>
								<DayCard date={date} />
							</Paper>
						))
					))}
				</SimpleGrid>
			</Stack>
		</Stack>
	);
};

export const DayCard = ({ date }: { date: PartialDate.Day }) => {
	const sources = useCacheEventsStore(
		useShallow(store => Object.entries(store.cacheByPartialDate).filter(([key]) => UtilPartialDate.includes(date, key as PartialDate)).map(([key, value]) => value).flat() || [])
	);

	const queries = useEventQueries(sources);

	return (
		<ScrollArea h="100%" mah="100%" w="100%">
			<Stack gap={0}>
				{queries.map(({ query, source }, index) => (
					<EventCard
						key={index}
						variant="inline"
						source={source}
						loading={query.isFetching}
						menu={<EventContextMenu source={source} />}
						err={query.data?.err}
						rev={query.data?.rev}
						data={query.data?.draft ?? query.data?.data ?? null}
						isDraft={!!query.data?.draft}
					/>
				))}
			</Stack>
		</ScrollArea>
	);
}

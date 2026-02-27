import { Spotlight } from "@mantine/spotlight";
import { IconCalendar, IconHome, IconList, IconSearch } from "@tabler/icons-react";
import { useState, type ReactNode } from "react";
import { UtilEventSource, type EventSource } from "../../../../db/models/event-source";
import { useNavigate } from "@tanstack/react-router";
import { useCacheEventsStore } from "../../../../lib/cache/useCacheEventsStore";
import { useShallow } from "zustand/shallow";
import { EventCard } from "../../../content/event/card/EventCard";
import { useEventQueries, useEventQuery } from "../../../../db/useEventQuery";
import { EventCardTitle } from "../../../content/event/card/EventCardTitle";
import { EventCardContext } from "../../../content/event/card/event-card-context";
import { EventCardBackground } from "../../../content/event/card/EventCardBackground";
import { OverLayer } from "../../../base/layout/OverLayer";
import { Box } from "@mantine/core";

export const VantageSpotlight = () => {
	const [query, setQuery] = useState("");
	const navigate = useNavigate();

	const searchResults = useCacheEventsStore(
		useShallow(state => Object.entries(state.cache.byText)
			.filter(([text]) => text.toLowerCase().includes(query.toLowerCase()))
			.flatMap(([, sources]) => sources)
		)
	);

	let actions: ReactNode[] = [];

	if (UtilEventSource.is(query, false))
		actions.push(
			<Spotlight.Action
				key="view-event-source"
				label="View Event"
				description={query}
				onClick={() => navigate({
					to: "/event",
					search: { source: query },
				})}
			/>
		);

	actions.push(...[
		{
			label: "Home",
			onClick: () => navigate({ to: "/" }),
			leftSection: <IconHome />,
		},
		{
			label: "List",
			onClick: () => navigate({ to: "/list" }),
			leftSection: <IconList />,
		},
		{
			label: "Calendar",
			onClick: () => navigate({ to: "/calendar" }),
			leftSection: <IconCalendar />,
		},
	].filter(props => props.label.toLowerCase().includes(query.toLowerCase())).map(props => (
		<Spotlight.Action key={props.label} {...props} />
	)));

	if (!!searchResults.length)
		actions.push(
			<Spotlight.ActionsGroup label="Events">
				{searchResults.map(source => (
					<SplotlightEventAction
						key={source}
						source={source}
					/>
				))}
			</Spotlight.ActionsGroup>
		);

	return (
		<Spotlight.Root
			query={query}
			onQueryChange={setQuery}
		>
			<Spotlight.Search placeholder="Search..." leftSection={<IconSearch size={16} />} />
			<Spotlight.ActionsList>
				{actions.length > 0 ? actions : <Spotlight.Empty>Nothing found...</Spotlight.Empty>}
			</Spotlight.ActionsList>
		</Spotlight.Root>
	);
};

export const SplotlightEventAction = ({ source }: { source: EventSource }) => {
	const navigate = useNavigate();

	const query = useEventQuery(source);

	return (
		<Spotlight.Action
			description={source}
			onClick={() => navigate({
				to: "/event",
				search: { source },
			})}
			pos="relative"
		>
			<EventCardContext
				value={{
					data: null,
					...query.data,
					loading: query.isFetching,
				}}
			>
				<EventCardBackground backgroundOpacity={0.5} />
				<Box pos="relative" style={{ zIndex: 1 }}>
					<EventCardTitle />
				</Box>
			</EventCardContext>
		</Spotlight.Action >
	);
};

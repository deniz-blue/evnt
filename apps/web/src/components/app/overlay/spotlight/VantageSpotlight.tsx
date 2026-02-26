import { Spotlight } from "@mantine/spotlight";
import { IconCalendar, IconHome, IconList, IconSearch } from "@tabler/icons-react";
import { useState, type ReactNode } from "react";
import { UtilEventSource } from "../../../../db/models/event-source";
import { useNavigate } from "@tanstack/react-router";
import { useCacheEventsStore } from "../../../../lib/cache/useCacheEventsStore";
import { useShallow } from "zustand/shallow";
import { EventCard } from "../../../content/event/card/EventCard";
import { useEventQueries } from "../../../../db/useEventQuery";

export const VantageSpotlight = () => {
	const [query, setQuery] = useState("");
	const navigate = useNavigate();
	const cacheResults = useCacheEventsStore(
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

	const queries = useEventQueries(cacheResults);

	if (!!queries.length)
		actions.push(
			<Spotlight.ActionsGroup label="Events">
				{queries.map(q => (
					<Spotlight.Action
						key={`event-${q.source}`}
						onClick={() => navigate({
							to: "/event",
							search: { source: q.source },
						})}
						p={0}
					>
						<EventCard
							data={null}
							source={q.source}
							fullHeight
							{...q.query.data}
						/>
					</Spotlight.Action>
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

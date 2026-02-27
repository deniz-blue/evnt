import { Spotlight } from "@mantine/spotlight";
import { IconCalendar, IconHome, IconList, IconSearch } from "@tabler/icons-react";
import { useState, type ReactNode } from "react";
import { UtilEventSource, type EventSource } from "../../../../db/models/event-source";
import { useMatches, useNavigate } from "@tanstack/react-router";
import { useCacheEventsStore } from "../../../../lib/cache/useCacheEventsStore";
import { useShallow } from "zustand/shallow";
import { useEventQuery } from "../../../../db/useEventQuery";
import { EventCardTitle } from "../../../content/event/card/EventCardTitle";
import { EventCardContext } from "../../../content/event/card/event-card-context";
import { EventCardBackground } from "../../../content/event/card/EventCardBackground";
import { Box } from "@mantine/core";
import { useActionsStore, type Action } from "./useActionsStore";

export const VantageSpotlight = () => {
	const [query, setQuery] = useState("");
	const navigate = useNavigate();
	const providedActions = useActionsStore(state => state.actions);
	const searchResults = useCacheEventsStore(
		useShallow(state => Object.entries(state.cache.byText)
			.filter(([text]) => text.toLowerCase().includes(query.toLowerCase()))
			.flatMap(([, sources]) => sources)
		)
	);

	const actions: Action[] = [];
	actions.push(...Object.values(providedActions));

	if (UtilEventSource.is(query, false))
		actions.push({
			label: "View Event",
			onClick: () => navigate({
				to: "/event",
				search: { source: query },
			}),
		});

	let elements = actions
		.filter(props => props.label?.toLowerCase().includes(query.toLowerCase()))
		.map((props, index) => (
			<Spotlight.Action
				key={index}
				leftSection={props.icon}
				{...props}
			/>
		))

	if (!!searchResults.length)
		elements.push(
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
				{elements.length > 0 ? elements : <Spotlight.Empty>Nothing found...</Spotlight.Empty>}
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

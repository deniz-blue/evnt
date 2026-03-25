import { ActionIcon, Box, Code, Container, Grid, Stack, Text, Tooltip } from "@mantine/core";
import { type EventSource } from "../../../../db/models/event-source";
import { LayerImportSection } from "./LayerImportSection";
import { IconReload } from "@tabler/icons-react";
import { useEventQuery } from "../../../../db/useEventQuery";
import { AsyncAction } from "../../../data/AsyncAction";
import { EventResolver } from "../../../../db/event-resolver";
import { EventDetailsContext } from "./event-details-context";
import { EventDetailsBanner } from "./EventDetailsBanner";
import { EventDetailsInstanceList } from "./EventDetailsInstanceList";
import { EventDetailsLinks } from "./EventDetailsLinks";
import { EnvelopeErrorAlert } from "../envelope/EnvelopeErrorAlert";
import { EventDetailsSource } from "./EventDetailsSource";

export interface EventDetailsContentProps {
	source?: EventSource;
	loading?: boolean;
	withModalCloseButton?: boolean;
}

export const EventDetailsContent = (props: EventDetailsContentProps) => {
	const { source } = props;

	return (
		<EventDetailsContext value={props}>
			<EventDetailsBanner />
			<Container mt="sm" w="100%">
				<Stack>
					<EnvelopeErrorAlert />

					{source && <LayerImportSection source={source} />}
				</Stack>

				<Grid>
					<Grid.Col
						span={{ base: 12, md: "auto" }}
						order={{ base: 1, md: 2 }}
					>
						<Stack>
							<EventDetailsInstanceList />
						</Stack>
					</Grid.Col>
					<Grid.Col
						span={{ base: 12, md: 4 }}
						order={{ base: 2, md: 1 }}
					>
						<Stack>
							<EventDetailsLinks />
							<EventDetailsSource source={source} />
						</Stack>
					</Grid.Col>
				</Grid>
			</Container>
		</EventDetailsContext>
	);
};

export const EventRefetchButton = ({ source }: { source: EventSource }) => {
	const { isFetching } = useEventQuery(source);

	return (
		<Tooltip label={"Refetch"} withArrow>
			<AsyncAction action={() => EventResolver.update(source)}>
				{({ loading, onClick }) => (
					<ActionIcon
						size="input-md"
						color="gray"
						loading={loading || isFetching}
						onClick={onClick}
					>
						<IconReload />
					</ActionIcon>
				)}
			</AsyncAction>
		</Tooltip>
	);
};

import { ActionIcon, Box, Code, Container, Group, Stack, Text, Tooltip } from "@mantine/core";
import { SmallTitle } from "../../base/SmallTitle";
import { MarkdownTranslations } from "../../base/MarkdownTranslations";
import { UtilEventSource, type EventSource } from "../../../../db/models/event-source";
import { LayerImportSection } from "./LayerImportSection";
import { ExternalLink } from "../../base/ExternalLink";
import { IconQuote, IconReload } from "@tabler/icons-react";
import { useEventQuery } from "../../../../db/useEventQuery";
import { AsyncAction } from "../../../data/AsyncAction";
import { EventResolver } from "../../../../db/event-resolver";
import { EventDetailsContext } from "./event-details-context";
import { EventDetailsBanner } from "./EventDetailsBanner";
import { EventDetailsInstanceList } from "./EventDetailsInstanceList";
import { EventDetailsLinks } from "./EventDetailsLinks";
import { useEventEnvelope } from "../event-envelope-context";

export interface EventDetailsContentProps {
	source?: EventSource;
	loading?: boolean;
	withModalCloseButton?: boolean;
}

export const EventDetailsContent = (props: EventDetailsContentProps) => {
	const { data } = useEventEnvelope();
	const { source } = props;

	return (
		<EventDetailsContext value={props}>
			<EventDetailsBanner />
			<Container mt="sm" w="100%">
				<Stack>
					{source && <LayerImportSection source={source} />}

					<EventDetailsInstanceList />

					<Stack gap={0}>
						<SmallTitle padLeft>
							description (wip)
						</SmallTitle>
						<Group gap={4} wrap="nowrap">
							<Box c="dimmed" display="flex">
								<IconQuote />
							</Box>
							<Stack gap={4}>
								{data?.description ? (
									<MarkdownTranslations content={data.description} />
								) : (
									<Text c="dimmed" span fs="italic">No description provided.</Text>
								)}
							</Stack>
						</Group>
					</Stack>

					<EventDetailsLinks />

					<Stack gap={0}>
						<Text c="dimmed" fz="xs">
							{source && ["http", "https"].includes(UtilEventSource.getType(source)) && (
								<Text span inherit>
									Source: <ExternalLink href={source} />
								</Text>
							)}

							{source && UtilEventSource.getType(source) == "at" && (
								<Text span inherit>
									Source: <Code>{source}</Code>
								</Text>
							)}

							{source && UtilEventSource.getType(source) == "local" && (
								<Text span inherit>
									Source: Locally saved
								</Text>
							)}
						</Text>
					</Stack>
				</Stack>
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

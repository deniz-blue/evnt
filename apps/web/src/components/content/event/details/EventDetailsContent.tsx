import { ActionIcon, Box, Code, Container, Group, Stack, Text, Tooltip } from "@mantine/core";
import { SmallTitle } from "../../base/SmallTitle";
import { MarkdownTranslations } from "../../base/MarkdownTranslations";
import { UtilEventSource, type EventSource } from "../../../../db/models/event-source";
import { LayerImportSection } from "./LayerImportSection";
import { ExternalLink } from "../../base/ExternalLink";
import type { EventEnvelope } from "../../../../db/models/event-envelope";
import { EventActions } from "../../../../lib/actions/event-actions";
import { VantageCopyButton } from "../../../app/VantageCopyButton";
import { IconCode, IconEdit, IconJson, IconLink, IconQuote, IconReload, IconShare } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useEventQuery } from "../../../../db/useEventQuery";
import { AsyncAction } from "../../../data/AsyncAction";
import { EventResolver } from "../../../../db/event-resolver";
import { EventDetailsContext } from "./event-details-context";
import { EventDetailsBanner } from "./EventDetailsBanner";
import { EventDetailsInstanceList } from "./EventDetailsInstanceList";
import { EventDetailsLinks } from "./EventDetailsLinks";

export interface EventDetailsContentProps extends Omit<EventEnvelope, "draft"> {
	source?: EventSource;
	loading?: boolean;
	isDraft?: boolean;
	withModalCloseButton?: boolean;
}

export const EventDetailsContent = (props: EventDetailsContentProps) => {
	const {
		data,
		source,
	} = props;

	return (
		<EventDetailsContext value={props}>
			<EventDetailsBanner />
			<Container mt="sm" w="100%">
				{source && <LayerImportSection source={source} />}

				<Stack align="end">
					<Group gap={4}>
						{source && UtilEventSource.isFromNetwork(source) && (
							<EventRefetchButton source={source} />
						)}
						<VantageCopyButton
							value={JSON.stringify(data, null, 2)}
							labelCopy="Copy event JSON"
							labelCopied="Event JSON copied to clipboard"
							icon={<IconJson />}
						/>
						{source && UtilEventSource.getType(source) === "at" && (
							<Tooltip label={"View on PDSls"} withArrow>
								<ActionIcon
									size="input-md"
									color="gray"
									component="a"
									href={`https://pds.ls/${source}`}
									target="_blank"
								>
									<Text span inline inherit fz="xs">
										PDS
									</Text>
								</ActionIcon>
							</Tooltip>
						)}
						{source && UtilEventSource.isFromNetwork(source) && (
							<VantageCopyButton
								value={EventActions.getEmbedLink(source)}
								labelCopied="Embed link copied to clipboard"
								labelCopy="Copy embed link"
								icon={<IconCode />}
							/>
						)}
						{source && UtilEventSource.isFromNetwork(source) && (
							<VantageCopyButton
								value={source}
								labelCopied="Source copied to clipboard"
								labelCopy="Copy source URL"
								icon={<IconLink />}
							/>
						)}
						{source && UtilEventSource.isFromNetwork(source) && (
							<VantageCopyButton
								value={EventActions.getShareLink(source)}
								labelCopied="Share link copied to clipboard"
								labelCopy="Copy share link"
								icon={<IconShare />}
							/>
						)}
						{source && UtilEventSource.isEditable(source) && (
							<Tooltip label={"Edit"} withArrow>
								<ActionIcon
									size="input-md"
									color="gray"
									renderRoot={(props) => (
										<Link
											to="/edit"
											search={{ source }}
											{...props}
										/>
									)}
								>
									<IconEdit />
								</ActionIcon>
							</Tooltip>
						)}
					</Group>
				</Stack>

				<EventDetailsInstanceList />

				<Stack gap={0}>
					<SmallTitle padLeft>
						description
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

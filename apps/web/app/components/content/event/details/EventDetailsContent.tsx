import type { EventData } from "@evnt/schema";
import { ActionIcon, Code, Group, Loader, Modal, Stack, Text, Title, Tooltip } from "@mantine/core";
import { Trans } from "../Trans";
import { SmallTitle } from "../../base/SmallTitle";
import { snippetInstance, snippetVenue, venueGoogleMapsLink, venueOpenStreetMapsLink } from "@evnt/pretty";
import { Snippet } from "../../Snippet";
import { MarkdownTranslations } from "../../base/MarkdownTranslations";
import { UtilEventSource, type EventSource } from "../../../../db/models/event-source";
import { LayerImportSection } from "./LayerImportSection";
import { EventLinkButton } from "../components/EventLinkButton";
import { ExternalLink } from "../../base/ExternalLink";
import type { EventEnvelope } from "../../../../db/models/event-envelope";
import { EventActions } from "../../../../lib/actions/event-actions";
import { VantageCopyButton } from "../../../app/VantageCopyButton";
import { IconCode, IconEdit, IconJson, IconLink, IconShare } from "@tabler/icons-react";
import { Link } from "react-router";
import { EnvelopeErrorBadge } from "../envelope/EnvelopeErrorBadge";

export const EventDetailsContent = ({
	data,
	source,
	err,
	loading,
}: {
	data: EventData;
	source?: EventSource;
	loading?: boolean;
	err?: EventEnvelope.Error;
}) => {
	return (
		<Stack>
			<Group gap={4}>
				<Group flex="1" gap={4}>
					{loading && (
						<Loader />
					)}
					<Title>
						<Trans t={data.name} />
					</Title>
					<EnvelopeErrorBadge err={err} />
				</Group>
				<Modal.CloseButton />
			</Group>

			{source && <LayerImportSection source={source} />}

			<Stack align="end">
				<Group gap={4}>
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
								component={Link}
								to={`/edit?${new URLSearchParams({ source })}`}
							>
								<IconEdit />
							</ActionIcon>
						</Tooltip>
					)}
				</Group>
			</Stack>

			<Stack gap={0}>
				<SmallTitle padLeft>
					venue{data.venues && data.venues.length !== 1 ? "s" : ""}
				</SmallTitle>
				<Stack gap={4}>
					{data.venues?.map((venue, index) => (
						<Stack key={index} gap={0}>
							<Snippet snippet={snippetVenue(venue)} />
							<Stack gap={0}>
								{venueGoogleMapsLink(venue) && (
									<Snippet snippet={{
										sublabel: {
											type: "external-link",
											name: "View on Google Maps",
											url: venueGoogleMapsLink(venue)!,
										},
									}} />
								)}
								{venueOpenStreetMapsLink(venue) && (
									<Snippet snippet={{
										sublabel: {
											type: "external-link",
											name: "View on OpenStreetMap",
											url: venueOpenStreetMapsLink(venue)!,
										},
									}} />
								)}
							</Stack>
						</Stack>
					))}
				</Stack>
			</Stack>
			<Stack gap={0}>
				<SmallTitle padLeft>
					date & time
				</SmallTitle>
				<Stack gap={4}>
					{data.instances?.map((instance, index) => (
						<Stack key={index} gap={0}>
							{snippetInstance(instance).map((snippet, snipIndex) => (
								<Snippet key={snipIndex} snippet={snippet} />
							))}
						</Stack>
					))}
				</Stack>
			</Stack>

			<Stack gap={0}>
				<SmallTitle padLeft>
					description
				</SmallTitle>
				<Stack gap={4}>
					{data.description ? (
						<MarkdownTranslations content={data.description} />
					) : (
						<Text c="dimmed" span fs="italic">No description provided.</Text>
					)}
				</Stack>
			</Stack>

			<Stack gap={0}>
				<SmallTitle padLeft>
					links
				</SmallTitle>
				<Stack gap={4}>
					{data.components?.filter(component => component.type == "link").map(x => x.data).map((link, index) => (
						<EventLinkButton key={index} value={link} />
					))}
				</Stack>
			</Stack>

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
		</Stack >
	);
};

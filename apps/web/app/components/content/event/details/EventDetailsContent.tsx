import type { EventData } from "@evnt/schema";
import { Code, Group, Loader, Modal, Stack, Text, Title } from "@mantine/core";
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
import { EventActions } from "../../../../lib/actions/events";
import { VantageCopyButton } from "../../../app/VantageCopyButton";
import { IconJson, IconLink, IconShare } from "@tabler/icons-react";

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
				{loading && (
					<Loader />
				)}
				<Title flex="1">
					<Trans t={data.name} />
				</Title>
				<Group gap={4}>
					<Modal.CloseButton />
				</Group>
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

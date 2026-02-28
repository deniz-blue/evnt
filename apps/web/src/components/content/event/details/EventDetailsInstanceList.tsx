import { Stack, Timeline } from "@mantine/core";
import { snippetInstance, snippetVenue, venueGoogleMapsLink, venueOpenStreetMapsLink } from "@evnt/pretty";
import { Snippet } from "../../Snippet";
import { ExternalLink } from "../../base/ExternalLink";
import { useEventEnvelope } from "../event-envelope-context";

export const EventDetailsInstanceList = () => {
	const { data } = useEventEnvelope();

	return (
		<Stack>
			<Timeline
				bulletSize={24}
				styles={{
					itemBody: { paddingLeft: 0 },
				}}
			>
				{data?.instances?.map((instance, i) => (
					<Timeline.Item
						key={i}
						bullet={i + 1}
					>
						<Stack>
							<Stack key={i} gap={0}>
								{snippetInstance(instance).map((snippet, snipIndex) => (
									<Snippet key={snipIndex} snippet={snippet} />
								))}

								{instance.venueIds
									.map(venueId => data.venues?.find(v => v.venueId === venueId))
									.filter(venue => venue !== undefined)
									.map((venue, index) => (
										<Stack key={index} gap={0}>
											<Snippet key={index} snippet={snippetVenue(venue!)} />

											<Stack gap={4} my={4} pl={28} fz="sm" align="start">
												{venueGoogleMapsLink(venue) && (
													<ExternalLink
														children="View on Google Maps"
														noTooltip
														href={venueGoogleMapsLink(venue)!}
													/>
												)}
												{venueOpenStreetMapsLink(venue) && (
													<ExternalLink
														children="View on OpenStreetMap"
														noTooltip
														href={venueOpenStreetMapsLink(venue)!}
													/>
												)}
											</Stack>
										</Stack>
									))}
							</Stack>
						</Stack>
					</Timeline.Item>
				))}
			</Timeline>
		</Stack>
	);
};

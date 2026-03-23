import type { EventData, Media } from "@evnt/schema";
import type { CommunityLexiconCalendarEvent } from "../../lexicons";
import { EventBuilder } from "@evnt/builder";
import { UtilPartialDate } from "@evnt/schema/utils";

export interface LexiconEvent extends CommunityLexiconCalendarEvent.Main {
	facets?: {
		index: { byteStart: number; byteEnd: number };
		features: Record<string, unknown>[];
	}[];

	media?: {
		$type?: "community.lexicon.calendar.event#media";
		alt?: string;
		role?: string;
		content: {
			$type: "blob";
			ref: { $link: string };
			size: number;
			mimeType: string;
		};
		aspect_ratio?: {
			width: number;
			height: number;
		};
	}[];

	additionalData?: Record<string, unknown>;
};

export const convertFromLexicon = (
	event: LexiconEvent,
	{
		language = "en",
	}: {
		language?: string;
	} = {},
): EventData => {
	const builder = new EventBuilder();

	if (event.name) builder.setName(event.name, language);

	for (let [index, location] of (event.locations || []).entries()) {
		switch (location.$type) {
			case "community.lexicon.calendar.event#uri":
				builder.addOnlineVenue(v => v
					.setId(index.toString())
					.setName(location.name ?? "", language)
					.setUrl(location.uri)
				);
				break;
			case "community.lexicon.location.address":
				builder.addPhysicalVenue(v => v
					.setId(index.toString())
					.setName(location.name ?? "", language)
					.setCountryCode(location.country)
					.setAddressLine([
						location.street,
						location.locality,
						location.region,
					].filter(Boolean).join(" "))
				);
				break;
			default:
				builder.addUnknownVenue(v => v
					.setId(index.toString())
					.setName(location.name ?? "", language)
				);
		}
	}

	if (event.startsAt || event.endsAt) {
		builder.addInstance(i => i
			.setStart(event.startsAt ? UtilPartialDate.fromDate(new Date(event.startsAt)) : undefined)
			.setEnd(event.endsAt ? UtilPartialDate.fromDate(new Date(event.endsAt)) : undefined)
		);
	}

	for (let link of event.uris || [])
		builder.addLink(l => l.setUrl(link.uri).setName(link.name ?? "", language));

	for (let [_index, media] of (event.media || []).entries()) {
		builder.data.components?.push({
			type: "splashMedia",
			data: {
				media: {
					alt: media.alt ? { [language]: media.alt } : undefined,
					sources: [
						// TODO: support atproto blobs
					],
				} as Media,
				roles: media.role ? [media.role] : [],
			},
		})
	}

	return builder.build();
};

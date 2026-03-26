import type { EventData, Media, PhysicalVenue } from "@evnt/schema";
import type { CommunityLexiconCalendarEvent } from "../../lexicons";
import { EventBuilder, PhysicalVenueBuilder } from "@evnt/builder";
import { UtilPartialDate } from "@evnt/schema/utils";
import type { AtprotoDid } from "@atcute/lexicons/syntax";

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
		did,
	}: {
		did?: AtprotoDid;
		language?: string;
	} = {},
): EventData => {
	const builder = new EventBuilder();

	if (event.name) builder.setName(event.name, language);

	const upsertPhysicalVenue = (name: string, fn: (b: PhysicalVenueBuilder) => PhysicalVenueBuilder) => {
		const idx = builder.data.venues?.findIndex(v => v.type === "physical" && v.name[language] === name);
		builder.data.venues ??= [];
		if (idx !== undefined && idx >= 0) {
			const venue = builder.data.venues[idx]!;
			builder.data.venues![idx]! = fn(new PhysicalVenueBuilder(venue as PhysicalVenue, builder)).build();
		} else {
			builder.addPhysicalVenue(b => fn(b).setName(name, language));
		}
	};

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
				upsertPhysicalVenue(location.name ?? "", b => b
					.setId(index.toString())
					.setCountryCode(location.country)
					.setAddressLine([
						location.street,
						location.locality,
						location.region,
					].filter(Boolean).join(" "))
				);
				break;
			case "community.lexicon.location.fsq":
			case "community.lexicon.location.geo":
				upsertPhysicalVenue(location.name ?? "", b => b
					.setId(index.toString())
					.setCoordinates({
						lat: parseInt(location.latitude ?? "0"),
						lng: parseInt(location.longitude ?? "0"),
					})
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
			.addAllVenues()
		);
	}

	for (let link of event.uris || [])
		builder.addLink(l => l.setUrl(link.uri).setName(link.name ?? "", language));

	for (let [_index, media] of (event.media || []).entries()) {
		if (did) builder.data.components?.push({
			type: "splashMedia",
			data: {
				media: {
					alt: media.alt ? { [language]: media.alt } : undefined,
					sources: [
						{
							// FIXME: hacky!
							url: `https://blobs.blue/${did}/blob/${media.content.ref.$link}`,
							mimeType: media.content.mimeType,
						}
					],
				} as Media,
				roles: [
					...(media.role ? [media.role] : []),
					"background",
					"poster",
				],
			},
		})
	}

	if (event.description) {
		builder.addCustomComponent("app.bsky.richtext", {
			text: event.description,
			facets: event.facets,
		});
	};

	if (event.additionalData) {
		builder.addCustomComponent("community.lexicon.calendar.event:additionalData", event.additionalData);
	}

	return builder.build();
};

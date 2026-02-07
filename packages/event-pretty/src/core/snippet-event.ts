import type { EventData, EventInstance, Venue } from "@evnt/schema";
import type { SnippetLabel, TSnippet } from "./snippet";
import { UtilPartialDate, UtilPartialDateRange, UtilTranslations } from "@evnt/schema/utils";

export const snippetEvent = (data: EventData, opts?: {
	maxVenues?: number;
}): TSnippet[] => {
	const snippets: TSnippet[] = [];

	const groupedInstances = data.instances?.reduce((acc, instance) => {
		const key = JSON.stringify(instance.venueIds.sort());
		acc[key] = acc[key] || [];
		acc[key].push(instance);
		return acc;
	}, {} as Record<string, EventInstance[]>);

	for (const [venueIdsJson, instances] of Object.entries(groupedInstances ?? {})) {
		const venueIds = JSON.parse(venueIdsJson) as string[];

		if (venueIds.length > (opts?.maxVenues ?? Infinity)) {
			let hasPhysical = false;
			let hasOnline = false;
			for (let venueId of venueIds) {
				const venue = data.venues?.find(v => v.venueId === venueId);
				if (!venue) continue;
				if (venue.venueType === "physical") hasPhysical = true;
				if (venue.venueType === "online") hasOnline = true;
			};

			snippets.push({
				icon: hasPhysical && hasOnline ? "venue-mixed" : hasPhysical ? "venue-physical" : (hasOnline ? "venue-online" : "venue-unknown"),
				label: {
					type: "translations",
					value: {
						en: `${venueIds.length} venues`,
					},
				},
			});
		} else {
			for (const venueId of venueIds) {
				const venue = data.venues?.find(v => v.venueId === venueId);
				if (!venue) continue;
				snippets.push(snippetVenue(venue));
			}
		}


		for (const instance of instances) {
			snippets.push(...snippetInstance(instance));
		};
	}

	return snippets;
};

export const snippetVenue = (venue: Venue): TSnippet => {
	let sublabel: SnippetLabel | undefined = undefined;

	if (venue.venueType === "physical" && venue.address) {
		sublabel = { type: "address", value: venue.address };
	} else if (venue.venueType === "online" && venue.url) {
		sublabel = { type: "external-link", url: venue.url };
	} else if (venue.venueType === "unknown") {
		sublabel = undefined;
	}

	return {
		icon: venue.venueType === "physical" ? "venue-physical" : venue.venueType === "online" ? "venue-online" : "venue-unknown",
		label: UtilTranslations.isEmpty(venue.venueName) ? { type: "placeholder", hint: "unnamed" } : { type: "translations", value: venue.venueName },
		sublabel,
	};
};

export const venueGoogleMapsLink = (venue: Venue): string | null => {
	if (venue.venueType !== "physical") return null;
	if (venue.googleMapsPlaceId) return `https://www.google.com/maps/place/?${new URLSearchParams({ q: `place_id:${venue.googleMapsPlaceId}` }).toString()}`;
	if (venue.coordinates) return `https://www.google.com/maps/search/?${new URLSearchParams({ api: "1", query: `${venue.coordinates.lat},${venue.coordinates.lng}` }).toString()}`;
	if (venue.address?.addr) return `https://www.google.com/maps/search/?${new URLSearchParams({ api: "1", query: venue.address.addr }).toString()}`;
	return null;
}

export const venueOpenStreetMapsLink = (venue: Venue): string | null => {
	if (venue.venueType !== "physical") return null;
	if (venue.coordinates) return `https://www.openstreetmap.org/?mlat=${venue.coordinates.lat}&mlon=${venue.coordinates.lng}#map=18/${venue.coordinates.lat}/${venue.coordinates.lng}`;
	if (venue.address?.addr) return `https://www.openstreetmap.org/search?${new URLSearchParams({ query: venue.address.addr }).toString()}`;
	return null;
}

export const snippetInstance = (instance: EventInstance): TSnippet[] => {
	const snippets: TSnippet[] = [];

	// Legend:
	// nothing = null
	// YYYY = year
	// YYYY-MM = month
	// YYYY-MM-DD = date
	// YYYY-MM-DDThh:mm = full

	// Things to account for:
	// start=null end=null => no date/time snippet
	// start=year end=null => date snippet only
	// start=month end=null => date snippet only
	// start=date end=null => date snippet only
	// start=full end=null => date and time snippet
	// start=year end=year => date-range if different, else date snippet only
	// start=month end=month => date-range if different, else date snippet only
	// start=date end=date => date-range if different, else date snippet only
	// start=full end=date => date-range if different, else date and time snippet

	// if we have date for start and end, and they are the same day, show single day snippet, otherwise show date-range snippet
	// if we have only start date, show single day snippet
	// if start=full and end=date, assume end time is 23:59 for comparison purposes
	// if we have time for start and end, and they are the same time, show single time snippet, otherwise show time-range snippet

	if (instance.start && instance.end && UtilPartialDateRange.isSingleDay(instance)) {
		snippets.push({
			icon: "calendar",
			label: { type: "partial-date", value: UtilPartialDate.getDatePart(instance.start) },
		})
	} else if (instance.start && instance.end) {
		snippets.push({
			icon: "calendar",
			label: { type: "date-time-range", value: { start: instance.start, end: instance.end } },
		})
	} else if (instance.start) {
		snippets.push({
			icon: "calendar",
			label: { type: "partial-date", value: UtilPartialDate.getDatePart(instance.start) },
		})
	}

	if (UtilPartialDateRange.isSingleDay(instance) && UtilPartialDateRange.isSameTime(instance)) {
		snippets.push({
			icon: "clock",
			label: { type: "time", value: UtilPartialDate.getTimePart(instance.start!)! },
		})
	} else if (
		instance.start
		&& instance.end
		&& UtilPartialDateRange.isSingleDay(instance)
		&& UtilPartialDate.hasTime(instance.start)
		&& UtilPartialDate.hasTime(instance.end)
	) {
		const start = { value: UtilPartialDate.getTimePart(instance.start!)!, date: UtilPartialDate.getDatePart(instance.start!) };
		const end = { value: UtilPartialDate.getTimePart(instance.end!)!, date: UtilPartialDate.getDatePart(instance.end!) };

		snippets.push({
			icon: "clock",
			label: { type: "time-range", value: { start, end } },
		})
	}

	return snippets;
};

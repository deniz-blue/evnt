import type { EventData, EventInstance, Venue } from "@evnt/schema";
import { UtilPartialDate, UtilTranslations } from "@evnt/schema/utils";
import type { EventDataQueryResult } from "../../db/useEventDataQuery";

export type EventFilter = (event: EventData) => boolean;

export const EventFilters = {
	None: () => true,

	SomeInstances: (predicate: (instance: EventInstance) => boolean): EventFilter => (data) => data.instances?.some(predicate) || false,
	AllInstances: (predicate: (instance: EventInstance) => boolean): EventFilter => (data) => data.instances?.every(predicate) || false,
	SomeVenues: (predicate: (venue: Venue) => boolean): EventFilter => (data) => data.venues?.some(predicate) || false,
	AllVenues: (predicate: (venue: Venue) => boolean): EventFilter => (data) => data.venues?.every(predicate) || false,

	Search: (search: string): EventFilter => {
		return (data: EventData) => {
			return [
				data.name ?? {},
				data.description ?? {},
			].some(translation => !!UtilTranslations.search(translation, search));
		};
	},

	HasVenueType: (venueType: string): EventFilter => (data) => data.venues?.some(venue => venue.venueType === venueType) || false,

	BeforeDate: (date: Date): EventFilter => {
		return EventFilters.SomeInstances((instance) => {
			if (!instance.start) return false;
			const instanceDate = UtilPartialDate.toDate(instance.start);
			return instanceDate < date;
		});
	},

	AfterDate: (date: Date): EventFilter => {
		return EventFilters.SomeInstances((instance) => {
			if (!instance.start) return false;
			const instanceDate = UtilPartialDate.toDate(instance.start);
			return instanceDate > date;
		});
	},
} as const;

export const applyEventFilters = (queries: EventDataQueryResult[], filters: EventFilter[]): EventDataQueryResult[] => {
	return queries.filter(({ query }) => {
		if (!query.data) return true;
		return filters.every((filter) => filter(query.data!));
	});
};

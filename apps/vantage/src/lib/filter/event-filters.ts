import type { EventData, EventInstance, Venue, VenueType } from "@evnt/schema";
import { UtilPartialDate } from "~/lib/util/schema-utils";
import type { EventQueryResult } from "../../db/useEventQuery";
import { TranslationsUtil } from "@evnt/translations";

export type EventFilter = (event: EventData) => boolean;

export const EventFilters = {
	None: () => true,

	SomeInstances: (predicate: (instance: EventInstance) => boolean): EventFilter => (data) => data.instances?.some(predicate) || false,
	AllInstances: (predicate: (instance: EventInstance) => boolean): EventFilter => (data) => data.instances?.every(predicate) || false,
	SomeVenues: (predicate: (venue: Venue) => boolean): EventFilter => (data) => data.venues?.some(predicate) || false,
	AllVenues: (predicate: (venue: Venue) => boolean): EventFilter => (data) => data.venues?.every(predicate) || false,

	Search: (search: string): EventFilter => {
		return (data: EventData) => {
			return [data.name ?? {}].some(translation => !!TranslationsUtil.search(translation, search));
		};
	},

	HasVenueType: (venueType: VenueType): EventFilter => (data) => data.venues?.some(venue => venue.$type === venueType) || false,

	BeforeDate: (date: Date): EventFilter => {
		return EventFilters.SomeInstances((instance) => {
			if (!instance.start) return false;
			const instanceDate = UtilPartialDate.toLowDate(instance.start);
			return instanceDate < date;
		});
	},

	AfterDate: (date: Date): EventFilter => {
		return EventFilters.SomeInstances((instance) => {
			if (!instance.start) return false;
			const instanceDate = UtilPartialDate.toHighDate(instance.start);
			return instanceDate > date;
		});
	},
} as const;

export const applyEventFilters = (queries: EventQueryResult[], filters: EventFilter[]): EventQueryResult[] => {
	return queries.filter(({ query }) => {
		if (!query.data || !query.data.data) return true;
		return filters.every((filter) => filter(query.data.data!));
	});
};

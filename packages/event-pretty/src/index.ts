import type { Address, EventData, EventInstance, PartialDate, Translations, Venue } from "@evnt/schema";
import { UtilPartialDate, UtilPartialDateRange } from "@evnt/schema/utils";

export type Range<T> = { start: T; end: T };

export type SnippetLabel =
    | { type: "text"; value: string }
    | { type: "translations"; value: Translations }
    | { type: "external-link"; value: string }
    | { type: "address"; value: Address }
    | { type: "partial-date"; value: PartialDate }
    | { type: "time"; value: string }
    | { type: "time-range"; value: Range<string> }
    | { type: "date-time"; value: PartialDate }
    | { type: "date-time-range"; value: Range<PartialDate> }

export type SnippetIcon =
    | "calendar"
    | "website"
    | "map-pin"
    | "clock"

export interface TSnippet {
    icon?: SnippetIcon;
    label: SnippetLabel;
    sublabel?: SnippetLabel;
    children?: TSnippet[];
};

export const snippetEvent = (data: EventData): TSnippet[] => {
    const snippets: TSnippet[] = [];

    const groupedInstances = data.instances.reduce((acc, instance) => {
        const key = JSON.stringify(instance.venueIds.sort());
        acc[key] = acc[key] || [];
        acc[key].push(instance);
        return acc;
    }, {} as Record<string, EventInstance[]>);

    for (const [venueIdsJson, instances] of Object.entries(groupedInstances)) {
        const venueIds = JSON.parse(venueIdsJson) as string[];

        for (const venueId of venueIds) {
            const venue = data.venues?.find(v => v.venueId === venueId);
            if (!venue) continue;
            snippets.push(snippetVenue(venue));
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
    } else if(venue.venueType === "online" && venue.url) {
        sublabel = { type: "external-link", value: venue.url };
    }

    return {
        icon: venue.venueType === "physical" ? "map-pin" : "website",
        label: { type: "translations", value: venue.venueName },
        sublabel,
    };
};

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

    if (UtilPartialDateRange.isSameTime(instance)) {
        snippets.push({
            icon: "clock",
            label: { type: "time", value: UtilPartialDate.getTimePart(instance.start!)! },
        })
    } else if (instance.start && instance.end && UtilPartialDate.hasTime(instance.start) && UtilPartialDate.hasTime(instance.end)) {
        snippets.push({
            icon: "clock",
            label: { type: "time-range", value: { start: UtilPartialDate.getTimePart(instance.start!)!, end: UtilPartialDate.getTimePart(instance.end!)! } },
        })
    }

    return snippets;
};

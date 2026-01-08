import type { EventData, PartialDate, Venue } from "@evnt/schema";

export interface FossEvent {
    abs_details_url: string;
    approved: string;
    cancellation_description: string;
    cancellation_description_html: string;
    cancelled: boolean;
    cfp_date: null | string;
    cfp_passed: null | boolean;
    coc_link: null | string;
    cfp_link: string | null;
    city: string;
    classes: string;
    country: string;
    date_string: string;
    description: string;
    description_html: string;
    details_url: string;
    end_date: string;
    end_day: string;
    end_month: string;
    end_month_string: string;
    end_year: string;
    fee: string;
    first_edition: string;
    geo: null | string;
    has_details: boolean;
    has_language_info: boolean;
    hashtag: string;
    homepage: string;
    hybrid: boolean;
    ical_path: string;
    id: string;
    interactivity: string;
    keywords_string: string;
    label: string;
    lat: null | number;
    lon: null | number;
    mailinglist: string;
    main_language: string;
    main_language_string: string;
    main_organiser: string | null;
    main_sponsors: null;
    mastodon: null | string;
    mastodon_handle: null | string;
    matrix: null | string;
    name: string;
    online: boolean;
    onlinebanner: string;
    only_online: boolean;
    osm_link: string;
    participants: string;
    physical: boolean;
    postponed: boolean;
    printable_date: string;
    printable_short_location: string;
    raw: object;
    date_end: string;
    date_start: string;
    readable_city: string;
    readable_location: string;
    registration: string;
    replacement: string;
    replaces: string | null;
    revision: string;
    specialities: string;
    specialities_html: string;
    start_date: string;
    start_day: string;
    start_month: string;
    start_month_string: string;
    start_year: string;
    timezone: string;
    type: string;
    upcoming: boolean;
    venue: string;
};

export default function convert(foss: FossEvent): EventData {
    const venues: Venue[] = [];
    if (foss.physical) {
        venues.push({
            venueId: ""+venues.length,
            venueType: "physical",
            venueName: { [foss.main_language]: foss.venue },
            address: {
                countryCode: foss.country,
            },
            coordinates: foss.lat && foss.lon ? { lat: foss.lat, lng: foss.lon } : undefined,
        });
    }

    return {
        v: 0,
        name: { [foss.main_language]: foss.name },
        description: { [foss.main_language]: foss.description },
        venues,
        instances: [
            {
                venueIds: venues.map(v => v.venueId),
                start: [foss.start_year, foss.start_month, foss.start_day].join("-") as PartialDate,
                end: [foss.end_year, foss.end_month, foss.end_day].join("-") as PartialDate,
            }
        ],
    };
}

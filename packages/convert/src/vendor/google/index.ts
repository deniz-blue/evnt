import type { EventData, PartialDate } from "@evnt/schema";
import { UtilPartialDate } from "@evnt/schema/utils";
import { calendar_v3 } from "googleapis";

export default function convert(data: calendar_v3.Schema$Event): EventData {
    let venues: EventData["venues"] = [];

    if (data.location) {
        // string ??? what tf do we do here
        venues.push({
            venueId: "google-calendar-location",
            venueType: "physical", // hm
            venueName: {
                en: data.location,
            },
        });
        // better than nothing i guess
    }

    const asPartialDate = ({
        date,
        dateTime,
        timeZone,
    }: { dateTime?: string | null; timeZone?: string | null; date?: string | null; }): PartialDate => {
        if (dateTime && !timeZone) return UtilPartialDate.fromDate(new Date(dateTime));
        if (dateTime && timeZone) {
            return UtilPartialDate.fromDate(new Date(
                new Date(dateTime).toLocaleString("en-US", { timeZone }),
            ));
        }
        return date as PartialDate;
    };

    return {
        v: 0,
        name: {
            en: data.summary,
        },
        description: {
            en: data.description || "",
        },
        instances: [
            {
                venueIds: venues.map(v => v.venueId),
                start: asPartialDate(data.start || {}),
                end: asPartialDate(data.end || {}),
            },
        ],
        venues,
    };
}

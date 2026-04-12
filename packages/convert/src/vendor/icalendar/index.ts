import type { EventData, PartialDate } from "@evnt/schema";
import { PartialDateUtil } from "@evnt/partial-date";
import { TranslationsUtil } from "@evnt/translations";
import ICAL from "ical.js";

export const convertFromVEvent = (
	vevent: ICAL.Component,
	{
		language = "en",
	}: {
		language?: string;
	} = {},
): EventData => {
	const event = new ICAL.Event(vevent);

	const eventData: EventData = {
		v: "0.1",
		name: { [language]: event.summary || "" },
		instances: [],
		venues: [],
		components: [],
	};

	for (let loc of event.component.getAllProperties("location")) {
		const location = loc.getFirstValue();
		if (typeof location == "string") eventData.venues!.push({
			id: `icalendar:${eventData.venues!.length}`,
			name: { [language]: location },
			$type: "directory.evnt.venue.unknown",
		});
	}

	if (event.startDate) {
		const startDate = event.startDate.toJSDate();
		eventData.instances!.push({
			venueIds: eventData.venues?.map(({ id }) => id) || [],
			start: PartialDateUtil.format({
				year: startDate.getUTCFullYear(),
				month: startDate.getUTCMonth() + 1,
				day: startDate.getUTCDate(),
				hour: startDate.getUTCHours(),
				minute: startDate.getUTCMinutes(),
				timezone: "UTC",
				precision: (startDate.getUTCHours() === 0 && startDate.getUTCMinutes() === 0) ? "day" : "time",
			} as PartialDate.Parsed),
			end: event.endDate ? PartialDateUtil.format({
				year: event.endDate.toJSDate().getUTCFullYear(),
				month: event.endDate.toJSDate().getUTCMonth() + 1,
				day: event.endDate.toJSDate().getUTCDate(),
				hour: event.endDate.toJSDate().getUTCHours(),
				minute: event.endDate.toJSDate().getUTCMinutes(),
				timezone: "UTC",
				precision: (event.endDate.toJSDate().getUTCHours() === 0 && event.endDate.toJSDate().getUTCMinutes() === 0) ? "day" : "time",
			} as PartialDate.Parsed) : undefined,
		});
	}

	for (let uri of event.component.getAllProperties("url")) {
		const url = uri.getFirstValue();
		if (typeof url == "string") eventData.components!.push({
			$type: "directory.evnt.component.link",
			url,
		});
	}

	return eventData;
};

export const convertToVEvent = (data: EventData, {
	language = "en",
}: {
	language?: string;
} = {}) => {
	const vevent = new ICAL.Component("vevent");
	const event = new ICAL.Event(vevent);

	event.summary = TranslationsUtil.translate(data.name, [language]);

	const partialDateAsICALTime = (date: PartialDate) => {
		const parsed = PartialDateUtil.parse(date);
		return new ICAL.Time({
			year: parsed.year,
			month: "month" in parsed ? parsed.month : 1,
			day: "day" in parsed ? parsed.day : 1,
			hour: "hour" in parsed ? parsed.hour : 0,
			minute: "minute" in parsed ? parsed.minute : 0,
			isDate: parsed.precision !== "time",
		}, ICAL.Timezone.utcTimezone);
	};

	let startDate: ICAL.Time | null = null;
	let endDate: ICAL.Time | null = null;
	for (const instance of data.instances ?? []) {
		if (instance.start) {
			const instanceStartDate = partialDateAsICALTime(instance.start);
			if (startDate === null || instanceStartDate.compare(startDate) < 0) {
				startDate = instanceStartDate;
			}
		}

		if (instance.end) {
			const instanceEndDate = partialDateAsICALTime(instance.end);
			if (endDate === null || instanceEndDate.compare(endDate) > 0) {
				endDate = instanceEndDate;
			}
		}
	}

	if (startDate !== null) event.startDate = startDate;
	if (endDate !== null) event.endDate = endDate;

	return vevent;
};

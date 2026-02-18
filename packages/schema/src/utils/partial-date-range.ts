import type { PartialDate } from "../types/PartialDate";
import { UtilPartialDate } from "./partial-date";

export interface PartialDateRange {
	start?: PartialDate;
	end?: PartialDate;
}

export class UtilPartialDateRange {
	static isRange(range: PartialDateRange): range is Required<PartialDateRange> {
		return (
			range.start !== undefined &&
			range.end !== undefined
		);
	}

	static isSameDay(range: PartialDateRange): boolean {
		if (!this.isRange(range)) return false;
		return (
			UtilPartialDate.hasDay(range.start) &&
			UtilPartialDate.hasDay(range.end) &&
			(UtilPartialDate.getDatePart(range.start) === UtilPartialDate.getDatePart(range.end))
		);
	}

	static isSameMonth(range: PartialDateRange): boolean {
		if (!this.isRange(range)) return false;
		return (
			UtilPartialDate.hasMonth(range.start) &&
			UtilPartialDate.hasMonth(range.end) &&
			(UtilPartialDate.asMonth(range.start) === UtilPartialDate.asMonth(range.end))
		);
	}

	static isSameYear(range: PartialDateRange): boolean {
		if (!this.isRange(range)) return false;
		return (
			UtilPartialDate.asYear(range.start) === UtilPartialDate.asYear(range.end)
		);
	}

	static isSameTime(range: PartialDateRange): boolean {
		if (!this.isRange(range)) return false;
		return (
			UtilPartialDate.hasTime(range.start) &&
			UtilPartialDate.hasTime(range.end) &&
			(UtilPartialDate.getTimePart(range.start) === UtilPartialDate.getTimePart(range.end))
		);
	}

	static isNextDay(range: PartialDateRange): boolean {
		if (!this.isRange(range)) return false;
		const ONE_DAY = 86400000; // milliseconds in a day
		return UtilPartialDate.hasDay(range.start) &&
			UtilPartialDate.hasDay(range.end) &&
			new Date(range.start).getTime() + ONE_DAY === new Date(range.end).getTime();
	}

	static getIncludedDates(range: PartialDateRange): PartialDate[] {
		const dates: PartialDate[] = [];
		if (!this.isRange(range)) {
			if (range.start) dates.push(range.start);
			if (range.end) dates.push(range.end);
			return dates;
		}
		let currentDate = UtilPartialDate.toLowDate(range.start);
		const endDate = UtilPartialDate.toLowDate(range.end);
		while (currentDate.getTime() <= endDate.getTime()) {
			dates.push(currentDate.toISOString().slice(0, 10) as PartialDate);
			currentDate.setDate(currentDate.getDate() + 1);
		}
		return dates;
	}
};

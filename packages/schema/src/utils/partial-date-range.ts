import type { PartialDate } from "../types/PartialDate";
import { UtilPartialDate } from "./partial-date";

export namespace PartialDateRange {
	export type BothExist = {
		start: PartialDate;
		end: PartialDate;
	};

	export type BothHasMonth = {
		start: PartialDate.Month | PartialDate.Day | PartialDate.Full;
		end: PartialDate.Month | PartialDate.Day | PartialDate.Full;
	};

	export type BothHasDay = {
		start: PartialDate.Day | PartialDate.Full;
		end: PartialDate.Day | PartialDate.Full;
	};

	export type BothFull = {
		start: PartialDate.Full;
		end: PartialDate.Full;
	};
};

export interface PartialDateRange {
	start?: PartialDate;
	end?: PartialDate;
};

export class UtilPartialDateRange {
	static isRange(range: PartialDateRange): range is PartialDateRange.BothExist {
		return (
			range.start !== undefined &&
			range.end !== undefined
		);
	}

	static isSameDay(range: PartialDateRange): range is PartialDateRange.BothHasDay {
		if (!this.isRange(range)) return false;
		return (
			this.bothHasDay(range) &&
			(UtilPartialDate.getDatePart(range.start) === UtilPartialDate.getDatePart(range.end))
		);
	}

	static bothHasTime(range: PartialDateRange): range is PartialDateRange.BothFull {
		if (!this.isRange(range)) return false;
		return (
			UtilPartialDate.hasTime(range.start) &&
			UtilPartialDate.hasTime(range.end)
		);
	}

	static bothHasDay(range: PartialDateRange): range is PartialDateRange.BothHasDay {
		if (!this.isRange(range)) return false;
		return (
			UtilPartialDate.hasDay(range.start) &&
			UtilPartialDate.hasDay(range.end)
		);
	}

	static bothHasMonth(range: PartialDateRange): range is PartialDateRange.BothHasMonth {
		if (!this.isRange(range)) return false;
		return (
			UtilPartialDate.hasMonth(range.start) &&
			UtilPartialDate.hasMonth(range.end)
		);
	}

	static isSameMonth(range: PartialDateRange): range is PartialDateRange.BothHasMonth {
		if (!this.isRange(range)) return false;
		return (
			this.bothHasMonth(range) &&
			(UtilPartialDate.asMonth(range.start) === UtilPartialDate.asMonth(range.end))
		);
	}

	static isSameYear(range: PartialDateRange): range is PartialDateRange.BothExist {
		if (!this.isRange(range)) return false;
		return (
			UtilPartialDate.asYear(range.start) === UtilPartialDate.asYear(range.end)
		);
	}

	static isSameTime(range: PartialDateRange): range is PartialDateRange.BothFull {
		if (!this.isRange(range)) return false;
		return (
			this.bothHasTime(range) &&
			(UtilPartialDate.getTimePart(range.start) === UtilPartialDate.getTimePart(range.end))
		);
	}

	static isNextDay(range: PartialDateRange): range is PartialDateRange.BothHasDay {
		if (!this.isRange(range)) return false;
		const ONE_DAY = 86400000; // milliseconds in a day
		return this.bothHasDay(range) &&
			new Date(range.start).getTime() + ONE_DAY === new Date(range.end).getTime();
	}

	static getIncludedDates(range: PartialDateRange): PartialDate.Day[] {
		const dates: PartialDate.Day[] = [];
		if (!this.isRange(range)) {
			if (range.start && UtilPartialDate.hasDay(range.start)) dates.push(UtilPartialDate.asDay(range.start));
			if (range.end && UtilPartialDate.hasDay(range.end)) dates.push(UtilPartialDate.asDay(range.end));
			return dates;
		}
		let currentDate = UtilPartialDate.toLowDate(range.start);
		const endDate = UtilPartialDate.toLowDate(range.end);
		while (currentDate.getTime() <= endDate.getTime()) {
			dates.push(currentDate.toISOString().slice(0, 10) as PartialDate.Day);
			currentDate.setDate(currentDate.getDate() + 1);
		}
		return dates;
	}
};

import { PartialDate } from "../types/PartialDate";
import { PartialDateUtils } from "./partial-date";

export interface PartialDateRange {
    start?: PartialDate;
    end?: PartialDate;
}

export class PartialDateRangeUtils {
    static isRange(range: PartialDateRange): range is Required<PartialDateRange> {
        return (
            range.start !== undefined &&
            range.end !== undefined
        );
    }

    static isSingleDay(range: PartialDateRange): boolean {
        if (!this.isRange(range)) return false;
        return (
            PartialDateUtils.hasCompleteDate(range.start) &&
            PartialDateUtils.hasCompleteDate(range.end) &&
            (PartialDateUtils.getDateString(range.start) === PartialDateUtils.getDateString(range.end))
        );
    }

    static isNextDay(range: PartialDateRange): boolean {
        if (!this.isRange(range)) return false;
        const ONE_DAY = 86400000; // milliseconds in a day
        return PartialDateUtils.hasCompleteDate(range.start) &&
            PartialDateUtils.hasCompleteDate(range.end) &&
            PartialDateUtils.toDate(range.start).getTime() + ONE_DAY === PartialDateUtils.toDate(range.end).getTime();
    }

    static getIncludedDates(range: PartialDateRange): PartialDate[] {
        const dates: PartialDate[] = [];
        if (!this.isRange(range)) {
            if (range.start) dates.push(range.start);
            if (range.end) dates.push(range.end);
            return dates;
        }
        let currentDate = PartialDateUtils.toDate(range.start);
        const endDate = PartialDateUtils.toDate(range.end);
        // me: hey copilot is this while function safe?
        // copilot: yes, because we check isRange above
        // me: thanks copilot <3
        // copilot: you're welcome!
        // me: what if start is after end?
        // copilot: then the while loop will not execute and an empty array will be returned
        // me: oh okay thank u
        while (currentDate.getTime() <= endDate.getTime()) {
            dates.push(currentDate.toISOString().slice(0, 10) as PartialDate);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    }
};

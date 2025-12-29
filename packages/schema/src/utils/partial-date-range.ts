import { PartialDate } from "../types/PartialDate";
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

    static isSingleDay(range: PartialDateRange): boolean {
        if (!this.isRange(range)) return false;
        return (
            UtilPartialDate.hasCompleteDate(range.start) &&
            UtilPartialDate.hasCompleteDate(range.end) &&
            (UtilPartialDate.getDateString(range.start) === UtilPartialDate.getDateString(range.end))
        );
    }

    static isNextDay(range: PartialDateRange): boolean {
        if (!this.isRange(range)) return false;
        const ONE_DAY = 86400000; // milliseconds in a day
        return UtilPartialDate.hasCompleteDate(range.start) &&
            UtilPartialDate.hasCompleteDate(range.end) &&
            UtilPartialDate.toDate(range.start).getTime() + ONE_DAY === UtilPartialDate.toDate(range.end).getTime();
    }

    static getIncludedDates(range: PartialDateRange): PartialDate[] {
        const dates: PartialDate[] = [];
        if (!this.isRange(range)) {
            if (range.start) dates.push(range.start);
            if (range.end) dates.push(range.end);
            return dates;
        }
        let currentDate = UtilPartialDate.toDate(range.start);
        const endDate = UtilPartialDate.toDate(range.end);
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

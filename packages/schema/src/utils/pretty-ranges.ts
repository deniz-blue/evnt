import { PartialDateRange, PartialDateRangeUtils } from "./partial-date-range";

export type PrettyRange = {
    // incomplete range, no start or end
    type: "none";
    range: PartialDateRange;
} | {
    // start and end are the same day, time can differ
    type: "single";
    range: PartialDateRange;
} | {
    // No range that spans multiple days
    // Grouped ranges that are consecutive days into a single range
    type: "merged";
    ranges: PartialDateRange[];
} | {
    // A single range that spans multiple days
    type: "long";
    range: PartialDateRange;
};

export const prettyRanges = (ranges: PartialDateRange[]): PrettyRange[] => {
    // TODO: implement merged range detection
    const result: PrettyRange[] = [];

    for (let range of ranges) {
        if (!PartialDateRangeUtils.isRange(range)) {
            result.push({ type: "none", range });
            continue;
        }

        if (PartialDateRangeUtils.isSingleDay(range)) {
            result.push({ type: "single", range });
            continue;
        }

        result.push({ type: "long", range });
    }

    return result;
}

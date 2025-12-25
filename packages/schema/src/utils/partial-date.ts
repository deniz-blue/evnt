import type { PartialDate } from "../types/PartialDate";

export class PartialDateUtils {
    static validate(value: string): value is PartialDate {
        return /^\d{4}(-\d{2}(-\d{2}(T\d{2}:\d{2})?)?)?$/.test(value);
    }

    static toDate(value: PartialDate): Date {
        const padded = value
            + (value.length == 4 ? "-01-01T00:00"
                : value.length == 7 ? "-01T00:00"
                    : value.length == 10 ? "T00:00"
                        : "");
        return new Date(padded + "Z");
    }

    static fromDate(date: Date): PartialDate {
        const iso = date.toISOString();
        return (iso.length == 27 ? iso.slice(1, 19) : iso.slice(0, 16)) as PartialDate;
    }

    static isComplete(value: PartialDate): boolean {
        return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value);
    }

    static hasCompleteDate(value: PartialDate): boolean {
        return /^\d{4}-\d{2}-\d{2}$/.test(value);
    }

    static hasMonth(value: PartialDate): boolean {
        return /^\d{4}-\d{2}$/.test(value);
    }

    static hasTime(value: PartialDate): boolean {
        return /T\d{2}:\d{2}$/.test(value);
    }

    static getTimeString(value: PartialDate): string | null {
        if (!this.hasTime(value)) return null;
        return value.slice(-5);
    }

    static getDateString(value: PartialDate): string {
        return value.slice(0, 10);
    }

    static toIntlString(value: PartialDate, {
        locale = "en",
        timezone: timeZone = "UTC",
        hour12 = false,
        weekday,
        noCurrentYear = true,
    }: {
        locale?: string;
        timezone?: string;
        hour12?: Intl.DateTimeFormatOptions["hour12"];
        weekday?: Intl.DateTimeFormatOptions["weekday"];
        noCurrentYear?: boolean;
    } = {}): string {
        const date = this.toDate(value);
        const options: Intl.DateTimeFormatOptions = {
            timeZone,
            year: noCurrentYear && new Date().getFullYear() === parseInt(value.slice(0, 4)) ? undefined : "numeric",
            hour12,
        };

        if (this.hasMonth(value))
            options.month = "long";

        if (this.hasCompleteDate(value)) {
            options.day = "numeric";
            options.weekday = weekday;
        }

        if (this.isComplete(value)) {
            options.hour = "2-digit";
            options.minute = "2-digit";
        }

        return date.toLocaleDateString(locale, options);
    }

    static compare(a: PartialDate, b: PartialDate): number {
        const dateA = this.toDate(a);
        const dateB = this.toDate(b);
        return dateA.getTime() - dateB.getTime();
    }

    static equals(a: PartialDate, b: PartialDate): boolean {
        return this.compare(a, b) === 0;
    }
};

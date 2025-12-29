import type { PartialDate } from "../types/PartialDate";

interface IntlStringOptions {
    locale?: string;
    timezone?: string;
    hour12?: Intl.DateTimeFormatOptions["hour12"];
    weekday?: Intl.DateTimeFormatOptions["weekday"];
    noCurrentYear?: boolean;
};

export class UtilPartialDate {
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
        return /^\d{4}-\d{2}-\d{2}/.test(value);
    }

    static hasMonth(value: PartialDate): boolean {
        return /^\d{4}-\d{2}/.test(value);
    }

    static hasTime(value: PartialDate): boolean {
        return /T\d{2}:\d{2}$/.test(value);
    }

    static getTimePart(value: PartialDate): string | null {
        if (!this.hasTime(value)) return null;
        return value.slice(-5);
    }

    static getDatePart(value: PartialDate): string {
        return value.slice(0, 10);
    }

    static toIntlString(value: PartialDate, {
        locale = "en",
        timezone: timeZone = "UTC",
        hour12 = false,
        weekday,
        noCurrentYear = true,
    }: IntlStringOptions = {}): string {
        const datePart = this.toIntlDateString(value, { locale, timezone: timeZone, weekday, noCurrentYear });
        const timePart = this.toIntlTimeString(value, { locale, timezone: timeZone, hour12 });
        return timePart ? `${datePart} ${timePart}` : datePart;
    }

    static toIntlDateString(value: PartialDate, options: IntlStringOptions = {}): string {
        const date = this.toDate(value);
        const dateOptions: Intl.DateTimeFormatOptions = {
            timeZone: options.timezone || "UTC",
            year: options.noCurrentYear && new Date().getFullYear() === parseInt(value.slice(0, 4)) ? undefined : "numeric",
            month: this.hasMonth(value) ? "long" : undefined,
            day: this.hasCompleteDate(value) ? "numeric" : undefined,
            weekday: options.weekday,
        };
        return date.toLocaleDateString(options.locale || "en", dateOptions);
    }

    static toIntlTimeString(value: PartialDate, options: IntlStringOptions = {}): string {
        if (!this.hasTime(value)) return "";
        const date = this.toDate(value);
        const timeOptions: Intl.DateTimeFormatOptions = {
            timeZone: options.timezone || "UTC",
            hour12: options.hour12 || false,
            hour: "2-digit",
            minute: "2-digit",
            second: undefined,
        };
        return date.toLocaleTimeString(options.locale || "en", timeOptions);
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

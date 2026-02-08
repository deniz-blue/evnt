import type { PartialDate } from "../types/PartialDate";

export interface PartialDateComponents {
	year?: number;
	month?: number;
	day?: number;
	hour?: number;
	minute?: number;
};

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

	/** Converts PartialDate to Date, filling missing parts with the lowest possible values */
	static toLowDate(value: PartialDate): Date {
		const padded = value
			+ (value.length == 4 ? "-01-01T00:00"
				: value.length == 7 ? "-01T00:00"
					: value.length == 10 ? "T00:00"
						: "");
		return new Date(padded + "Z");
	}

	/** Converts PartialDate to Date, filling missing parts with the highest possible values */
	static toHighDate(value: PartialDate): Date {
		const padded = value
			+ (value.length == 4 ? "-12-31T23:59"
				: value.length == 7 ? "-31T23:59"
					: value.length == 10 ? "T23:59"
						: "");
		return new Date(padded + "Z");
	}

	static fromDate(date: Date): PartialDate {
		const iso = date.toISOString();
		return (iso.length == 27 ? iso.slice(1, 19) : iso.slice(0, 16)) as PartialDate;
	}

	static isComplete(value: PartialDate): value is PartialDate.Full {
		return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value);
	}

	static hasCompleteDate(value: PartialDate): value is PartialDate.Day | PartialDate.Full {
		return /^\d{4}-\d{2}-\d{2}/.test(value);
	}

	static hasMonth(value: PartialDate): value is PartialDate.Month | PartialDate.Day | PartialDate.Full {
		return /^\d{4}-\d{2}/.test(value);
	}

	static hasTime(value: PartialDate): value is PartialDate.Full {
		return /T\d{2}:\d{2}$/.test(value);
	}

	static getTimePart(value: PartialDate): string | null {
		if (!this.hasTime(value)) return null;
		return value.slice(-5);
	}

	static getDatePart(value: PartialDate): PartialDate.Year | PartialDate.Month | PartialDate.Day {
		return value.slice(0, 10) as PartialDate.Year | PartialDate.Month | PartialDate.Day;
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
		const date = this.toLowDate(value);
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
		const date = this.toLowDate(value);
		const timeOptions: Intl.DateTimeFormatOptions = {
			timeZone: options.timezone || "UTC",
			hour12: options.hour12 || false,
			hour: "2-digit",
			minute: "2-digit",
			second: undefined,
		};
		return date.toLocaleTimeString(options.locale || "en", timeOptions);
	}

	static now(): PartialDate {
		return this.fromDate(new Date());
	}

	static today(): PartialDate.Day {
		return new Date().toISOString().slice(0, 10) as PartialDate.Day;
	}

	static thisMonth(): PartialDate.Month {
		return new Date().toISOString().slice(0, 7) as PartialDate.Month;
	}

	static toComponents(value: PartialDate): PartialDateComponents {
		const components: PartialDateComponents = {};
		if (this.hasMonth(value)) {
			components.year = parseInt(value.slice(0, 4));
			components.month = parseInt(value.slice(5, 7));
		}
		if (this.hasCompleteDate(value)) {
			components.day = parseInt(value.slice(8, 10));
		}
		if (this.hasTime(value)) {
			components.hour = parseInt(value.slice(11, 13));
			components.minute = parseInt(value.slice(14, 16));
		}
		return components;
	}

	static fromComponents(components: PartialDateComponents): PartialDate {
		let value = "";
		if (components.year) value += components.year.toString().padStart(4, "0");
		if (components.month) value += "-" + components.month.toString().padStart(2, "0");
		if (components.day) value += "-" + components.day.toString().padStart(2, "0");
		if (components.hour !== undefined && components.minute !== undefined) value += "T" + components.hour.toString().padStart(2, "0") + ":" + components.minute.toString().padStart(2, "0");
		return value as PartialDate;
	}

	static compare(a: PartialDate, b: PartialDate): number {
		const dateA = this.toLowDate(a);
		const dateB = this.toLowDate(b);
		return dateA.getTime() - dateB.getTime();
	}

	static equals(a: PartialDate, b: PartialDate): boolean {
		return this.compare(a, b) === 0;
	}
};

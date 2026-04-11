export namespace PartialDate {
	type TimezoneIdentifier = string;
	export type YearOnly = `${number}[${TimezoneIdentifier}]`;
	export type YearMonth = `${number}-${number}[${TimezoneIdentifier}]`;
	export type YearMonthDay = `${number}-${number}-${number}[${TimezoneIdentifier}]`;
	export type YearMonthDayTime = `${number}-${number}-${number}T${number}:${number}[${TimezoneIdentifier}]`;

	export type Precision = "year" | "month" | "day" | "time";

	export type Parsed = Parsed.YearOnly | Parsed.YearMonth | Parsed.YearMonthDay | Parsed.YearMonthDayTime;
	export namespace Parsed {
		export type Fields = {
			timezone: TimezoneIdentifier;
			year: number;
			month: number;
			day: number;
			hour: number;
			minute: number;
		};
		export type YearOnly = Pick<Fields, "year" | "timezone"> & { precision: "year" };
		export type YearMonth = Pick<Fields, "year" | "month" | "timezone"> & { precision: "month" };
		export type YearMonthDay = Pick<Fields, "year" | "month" | "day" | "timezone"> & { precision: "day" };
		export type YearMonthDayTime = Fields & { precision: "time" };
	}
}

export type PartialDate = PartialDate.YearOnly | PartialDate.YearMonth | PartialDate.YearMonthDay | PartialDate.YearMonthDayTime;

export const PartialDateRegex = /^(?<year>\d{4})(?:-(?<month>\d{2})(?:-(?<day>\d{2})(?:T(?<time>(?<hour>\d{2}):(?<minute>\d{2}))?)?)?)?(?:\[(?<timezone>[\w\/]+)\])?$/;

export class PartialDateUtil {
	/** Checks if a string is a valid PartialDate */
	static isValid(pd: string): pd is PartialDate {
		return PartialDateRegex.test(pd);
	}

	/**
	 * Parses a PartialDate string into a structured object
	 * @param pd A PartialDate string to parse into a structured object
	 * @returns Parsed representation of the PartialDate
	 */
	static parse(pd: PartialDate): PartialDate.Parsed {
		const match = PartialDateRegex.exec(pd);
		if (!match || !match.groups) {
			throw new Error(`Invalid partial date format: ${pd}`);
		}

		const { year, month, day, hour, minute, timezone } = match.groups;
		const parsed: PartialDate.Parsed.Fields = {
			timezone: timezone ? timezone : "UTC",
			year: parseInt(year!, 10),
			month: month ? parseInt(month, 10) : 1,
			day: day ? parseInt(day, 10) : 1,
			hour: hour ? parseInt(hour, 10) : 0,
			minute: minute ? parseInt(minute, 10) : 0,
		};

		if (hour && minute) {
			return { ...parsed, precision: "time" };
		} else if (day) {
			return { ...parsed, precision: "day" };
		} else if (month) {
			return { ...parsed, precision: "month" };
		} else {
			return { ...parsed, precision: "year" };
		}
	}

	static format(parsed: PartialDate.Parsed): PartialDate {
		let str = parsed.year.toString();
		if ("month" in parsed) str += `-${String(parsed.month).padStart(2, "0")}`;
		if ("day" in parsed) str += `-${String(parsed.day).padStart(2, "0")}`;
		if ("hour" in parsed && "minute" in parsed) str += `T${String(parsed.hour).padStart(2, "0")}:${String(parsed.minute).padStart(2, "0")}`;
		str += `[${parsed.timezone}]`;
		return str as PartialDate;
	}

	static getPrecision(pd: PartialDate): PartialDate.Precision {
		const parsed = this.parse(pd);
		return parsed.precision;
	}

	static has(pd: PartialDate, field: "month" | "day" | "time"): boolean {
		const parsed = this.parse(pd);
		switch (field) {
			case "time": return parsed.precision === "time";
			case "day": return parsed.precision === "day" || parsed.precision === "time";
			case "month": return parsed.precision === "month" || parsed.precision === "day" || parsed.precision === "time";
			default: return false;
		}
	}

	static parsedFromTemporal(obj: Temporal.ZonedDateTime | Temporal.PlainDateTime | Temporal.PlainDate | Temporal.PlainYearMonth): PartialDate.Parsed {
		return {
			precision: ("hour" in obj && "minute" in obj) ? "time" : ("day" in obj ? "day" : "month"),
			year: obj.year,
			month: obj.month,
			day: "day" in obj ? obj.day : undefined,
			hour: "hour" in obj ? obj.hour : undefined,
			minute: "minute" in obj ? obj.minute : undefined,
			timezone: "timeZoneId" in obj ? obj.timeZoneId : "UTC",
		} as PartialDate.Parsed;
	}

	static now(timeZone?: Temporal.TimeZoneLike): PartialDate {
		const now = Temporal.Now.zonedDateTimeISO(timeZone);
		return this.format(this.parsedFromTemporal(now));
	}

	static parsedAsPlainYearMonth(parsed: Exclude<PartialDate.Parsed, PartialDate.Parsed.YearOnly>): Temporal.PlainYearMonth {
		return new Temporal.PlainYearMonth(parsed.year, parsed.month);
	}

	static parsedAsPlainDate(parsed: Exclude<PartialDate.Parsed, PartialDate.Parsed.YearOnly | PartialDate.Parsed.YearMonth>): Temporal.PlainDate {
		return new Temporal.PlainDate(parsed.year, parsed.month, parsed.day);
	}

	static parsedAsPlainDateTime(parsed: PartialDate.Parsed.YearMonthDayTime): Temporal.PlainDateTime {
		return new Temporal.PlainDateTime(parsed.year, parsed.month, parsed.day, parsed.hour, parsed.minute);
	}

	static parsedAsZonedDateTime(parsed: PartialDate.Parsed.YearMonthDayTime): Temporal.ZonedDateTime {
		return this.parsedAsPlainDateTime(parsed).toZonedDateTime(parsed.timezone);
	}
}


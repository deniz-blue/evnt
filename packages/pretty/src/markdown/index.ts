import type { PartialDate } from "@evnt/schema";
import { PartialDateUtil } from "@evnt/partial-date";
import type { SnippetIcon, SnippetLabel, TSnippet } from "../core/snippet";

export interface Locale {
	language?: string;
	timezone?: string;
};

export const DefaultLocale: Required<Locale> = {
	language: "en",
	timezone: "UTC",
};

export const getClockEmoji = (time: string) => {
	const [hours, minutes] = time.split(":").map(Number);
	let hour12 = (hours ?? 0) % 12 || 12;
	const base = ((minutes ?? 0) >= 30) ? 0x1F55C : 0x1F550;
	return String.fromCodePoint(base + hour12 - 1);
};

const partialDateToIntlString = (value: PartialDate, locale: string, timezone: string): string => {
	const parsed = PartialDateUtil.parse(value);
	const date = new Date(Date.UTC(
		parsed.year,
		"month" in parsed ? parsed.month - 1 : 0,
		"day" in parsed ? parsed.day : 1,
		"hour" in parsed ? parsed.hour : 0,
		"minute" in parsed ? parsed.minute : 0,
	));

	if (parsed.precision === "year") {
		return new Intl.DateTimeFormat(locale, { year: "numeric", timeZone: timezone }).format(date);
	}

	if (parsed.precision === "month") {
		return new Intl.DateTimeFormat(locale, { year: "numeric", month: "long", timeZone: timezone }).format(date);
	}

	if (parsed.precision === "day") {
		return new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "numeric", timeZone: timezone }).format(date);
	}

	return new Intl.DateTimeFormat(locale, {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
		timeZone: timezone,
	}).format(date);
};

export const snippetLabelToMarkdown = (label: SnippetLabel, locale: Locale = DefaultLocale): string => {
	if (label.type === "text") return label.value;
	if (label.type === "placeholder") switch (label.hint) {
		case "unknown": return "Unknown";
		case "unnamed": return "Unnamed";
	}
	if (label.type === "translations")
		return label.value[locale.language || DefaultLocale.language] || label.value[Object.keys(label.value)[0]!] || "";
	if (label.type === "external-link")
		return label.name ? `[${label.name}](${label.url})` : label.url;
	if (label.type === "address")
		return (label.value.addr ?? "") + (label.value.countryCode ? (" " + (
			String.fromCodePoint(...label.value.countryCode.toUpperCase()
				.split("")
				.map(char => 127397 + char.charCodeAt(0)))
		)) : "");

	if (label.type === "partial-date" || label.type === "date-time") return partialDateToIntlString(
		label.value,
		locale.language || DefaultLocale.language,
		locale.timezone || DefaultLocale.timezone,
	) + (PartialDateUtil.has(label.value, "time") ? ` (${locale.timezone || DefaultLocale.timezone})` : "");

	if (label.type === "time") return `${label.value} (${locale.timezone || DefaultLocale.timezone})`;

	if (label.type === "time-range") return `${label.value.start.value} - ${label.value.end.value} (${locale.timezone || DefaultLocale.timezone})`;

	if (label.type === "date-time-range") return `${partialDateToIntlString(
		label.value.start,
		locale.language || DefaultLocale.language,
		locale.timezone || DefaultLocale.timezone,
	)} - ${partialDateToIntlString(
		label.value.end,
		locale.language || DefaultLocale.language,
		locale.timezone || DefaultLocale.timezone,
	)} (${locale.timezone || DefaultLocale.timezone})`;

	return "";
};

export const snippetToMarkdown = (snippet: TSnippet, locale: Locale = DefaultLocale): string => {
	let emoji = snippet.icon ? ({
		clock: getClockEmoji(snippet.label?.type === "time" ? snippet.label.value : "00:00"),
		calendar: "📅",
		"venue-online": "🌐",
		"venue-physical": "📍",
		"venue-mixed": "📍",
		"venue-unknown": "📍",
	} as Record<SnippetIcon, string>)[snippet.icon] : "";

	let label = snippet.label ? snippetLabelToMarkdown(snippet.label, locale) : "";

	return [emoji, label].filter(Boolean).join(" ");
};

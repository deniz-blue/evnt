import type { Address, PartialDate, Translations } from "@evnt/schema";

export type Range<T> = { start: T; end: T };

export type SnippetLabel =
	| { type: "text"; value: string }
	| { type: "translations"; value: Translations }
	| { type: "external-link"; url: string; name?: string }
	| { type: "address"; value: Address }
	| { type: "partial-date"; value: PartialDate }
	| { type: "time"; value: string }
	| { type: "time-range"; value: Range<string> }
	| { type: "date-time"; value: PartialDate }
	| { type: "date-time-range"; value: Range<PartialDate> }

export type SnippetIcon =
	| "venue-online"
	| "venue-physical"
	| "venue-mixed"
	| "calendar"
	| "clock"

export interface TSnippet {
	icon?: SnippetIcon;
	label?: SnippetLabel;
	sublabel?: SnippetLabel;
	children?: TSnippet[];
};

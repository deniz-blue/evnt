import z from "zod";
import { UtilPartialDate } from "../utils/partial-date";

export namespace PartialDate {
	export type YearOnly = `${number}`;
	export type YearMonth = `${number}-${number}`;
	export type DateOnly = `${number}-${number}-${number}`;
	export type Full = `${number}-${number}-${number}T${number}:${number}`;
}

export type PartialDate = PartialDate.YearOnly | PartialDate.YearMonth | PartialDate.DateOnly | PartialDate.Full;

export const PartialDateSchema = z.string()
	.refine((val) => UtilPartialDate.validate(val), { error: "Invalid PartialDate format" })
	.meta({
		id: "PartialDate",
		description: "An ISO 8601 date and time string that may be incomplete (e.g. '2023', '2023-05') and does not include timezone information (forced UTC)",
		regex: "^\\d{4}(-\\d{2}(-\\d{2}(T\\d{2}:\\d{2})?)?)?$",
		examples: [
			"2023",
			"2023-05",
			"2023-05-15",
			"2023-05-15T13:45",
		],
		// vscode snippet support
		defaultSnippets: [
			{
				label: "Current Date&Time",
				body: "${1:${CURRENT_YEAR}-${CURRENT_MONTH}-${CURRENT_DATE}T${CURRENT_HOUR}:${CURRENT_MINUTE}}",
			},
		],
	});

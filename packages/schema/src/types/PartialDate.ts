import z from "zod";
import { UtilPartialDate } from "../utils/partial-date";

export type PartialDate = z.infer<typeof PartialDateSchema>;
export const PartialDateSchema = z.string()
    .brand<"PartialDate">()
    .refine((val) => UtilPartialDate.validate(val), { error: "Invalid PartialDate format" })
    .meta({
        id: "PartialDate",
        description: "An ISO 8601 date and time string that may be incomplete (e.g. '2023', '2023-05') and does not include timezone information (forced UTC)",
        // vscode snippet support
        defaultSnippets: [
            {
                label: "Current Date&Time",
                body: "${1:${CURRENT_YEAR}-${CURRENT_MONTH}-${CURRENT_DATE}T${CURRENT_HOUR}:${CURRENT_MINUTE}}",
            },
        ],
    });

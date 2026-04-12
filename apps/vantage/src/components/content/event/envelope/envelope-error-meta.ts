import z from "zod";
import type { EventEnvelope } from "../../../../db/models/event-envelope";

export const getEnvelopeErrorMeta = (err: EventEnvelope.Error) => {
	let color: "red" | "yellow" = "red";
	let message = "";
	let details = "";

	if (err.kind === "json-parse" || err.kind === "validation") {
		color = "yellow";
	} else {
		color = "red";
	};

	if (err.kind === "fetch") details = err.message;
	if (err.kind === "json-parse") details = err.message;
	if (err.kind === "validation") details = z.prettifyError(err);
	if (err.kind === "xrpc") details = `${err.error}: ${err.message}`;
	if (err.kind === "unknown-data-type") details = `Unknown data type: ${err.dataType}`;

	if (err.kind === "fetch") message = "Fetch Error";
	if (err.kind === "json-parse") message = "JSON Parse Error";
	if (err.kind === "validation") message = "Validation Error";
	if (err.kind === "xrpc") message = "XRPC Error";
	if (err.kind === "unknown-data-type") message = "Unknown Data Type";

	return {
		color,
		message,
		details,
		status: "status" in err && err.status ? err.status : null,
	} as const;
};

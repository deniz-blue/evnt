import { Badge, Stack, Text, Tooltip } from "@mantine/core";
import type { EventEnvelope } from "../../../../db/models/event-envelope";
import z from "zod";

export const EnvelopeErrorBadge = ({ err }: { err?: EventEnvelope.Error }) => {
	if (!err) return null;

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

	if (err.kind === "fetch") message = "Fetch Error";
	if (err.kind === "json-parse") message = "JSON Parse Error";
	if (err.kind === "validation") message = "Validation Error";
	if (err.kind === "xrpc") message = "XRPC Error";

	return (
		<Tooltip label={(
			<Stack align="center" gap={4}>
				<Text fw="bold" span inherit>{message}</Text>
				<Text inherit span style={{ whiteSpace: "pre" }}>
					{details}
				</Text>
			</Stack>
		)} multiline>
			<Badge color={color} variant="outline">
				{"status" in err && err.status ? err.status : "ERR"}
			</Badge>
		</Tooltip>
	);
};

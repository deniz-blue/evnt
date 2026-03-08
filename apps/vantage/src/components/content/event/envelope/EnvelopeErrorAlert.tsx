import { Alert } from "@mantine/core";
import type { EventEnvelope } from "../../../../db/models/event-envelope";
import { getEnvelopeErrorMeta } from "./envelope-error-meta";
import { useEventEnvelope } from "../event-envelope-context";

export const EnvelopeErrorAlert = () => {
	const { err } = useEventEnvelope();
	if (!err) return null;
	const { color, message, details, status } = getEnvelopeErrorMeta(err) ?? {};

	return (
		<Alert
			color={color}
			variant="light"
			title={message + (status ? ` (${status})` : "")}
			styles={{
				body: {
					whiteSpace: "pre",
				},
			}}
		>
			{details}
		</Alert>
	);
};

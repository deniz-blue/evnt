import { Alert, type BoxProps } from "@mantine/core";
import { getEnvelopeErrorMeta } from "./envelope-error-meta";
import { useResolvedEvent } from "../event-envelope-context";

export const EnvelopeErrorAlert = (props: BoxProps) => {
	const { err } = useResolvedEvent();
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
			{...props}
		>
			{details}
		</Alert>
	);
};

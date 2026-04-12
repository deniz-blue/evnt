import { Badge, Stack, Text, Tooltip, type BoxProps } from "@mantine/core";
import { getEnvelopeErrorMeta } from "./envelope-error-meta";
import { useResolvedEvent } from "../event-envelope-context";

export const EnvelopeErrorBadge = (props: BoxProps) => {
	const { err } = useResolvedEvent();
	if (!err) return null;

	const { color, message, details, status } = getEnvelopeErrorMeta(err);

	return (
		<Tooltip label={(
			<Stack align="center" gap={4}>
				<Text fw="bold" span inherit>{message}</Text>
				<Text inherit span style={{ whiteSpace: "pre" }}>
					{details}
				</Text>
			</Stack>
		)} multiline>
			<Badge color={color} variant="outline" {...props}>
				{status ?? "ERR"}
			</Badge>
		</Tooltip>
	);
};

import { Badge, Group, Loader, Paper, Stack, Text, Tooltip } from "@mantine/core";
import { Trans } from "./Trans";
import type { EventData } from "@evnt/schema";
import { EventInstanceList } from "./EventInstanceList";
import { SubtleLink } from "../base/SubtleLink";
import { useEventDetailsModal } from "../../../hooks/app/useEventDetailsModal";
import { type EventSource } from "../../../db/models/event-source";
import type { EventEnvelope } from "../../../db/models/event-envelope";
import z from "zod";

export const EventCard = ({
	variant = "card",
	value,
	menu,
	source,
	err,
	loading,
}: {
	variant?: "horizontal" | "card";
	value: EventData;
	source?: EventSource;
	menu?: React.ReactNode;
	err?: EventEnvelope.Error;
	loading?: boolean;
}) => {
	const { openLink } = useEventDetailsModal();

	return (
		<Paper
			p="xs"
			withBorder
			w="100%"
			h={variant === "card" ? "100%" : undefined}
		>
			<Stack>
				<Group>
					<Stack gap={0} flex="1">
						<Group gap={4} align="center">
							{loading && <Loader size="xs" />}
							<SubtleLink if={!!source} to={openLink(source!)}>
								<Text fw="bold" span>
									<Trans t={value.name} />
								</Text>
							</SubtleLink>
							<EnvelopeErrorDisplay err={err} />
						</Group>
						<Text fz="sm" c="dimmed" inline span>
							{("label" in value && value.label) && (
								<Trans t={value.label} />
							)}
						</Text>
					</Stack>
					{menu}
				</Group>

				{variant === "card" && (
					<EventInstanceList value={value} />
				)}
			</Stack>
		</Paper>
	)
};

export const EnvelopeErrorDisplay = ({
	err,
}: {
	err?: EventEnvelope.Error;
}) => {
	if (err?.kind === "fetch") return (
		<Tooltip label={err.message}>
			<Badge color="red" variant="outline">{err.status || "Error"}</Badge>
		</Tooltip>
	);

	if (err?.kind === "json-parse") return (
		<Tooltip label={err.message}>
			<Badge color="red" variant="outline">Invalid</Badge>
		</Tooltip>
	);

	if (err?.kind === "validation") return (
		<Tooltip label={z.prettifyError(err)}>
			<Badge color="red" variant="outline">Invalid</Badge>
		</Tooltip>
	);

	if (err?.kind === "xrpc") return (
		<Tooltip label={`${err.error} ${err.message}`}>
			<Badge color="red" variant="outline">Error</Badge>
		</Tooltip>
	);

	return null;
};

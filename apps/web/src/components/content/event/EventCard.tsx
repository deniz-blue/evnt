import { Anchor, Badge, Group, Loader, Paper, Skeleton, Stack, Text, Transition, type MantineTransition } from "@mantine/core";
import { Trans } from "./Trans";
import { EventInstanceList } from "./EventInstanceList";
import { useEventDetailsModal } from "../../../hooks/app/useEventDetailsModal";
import { UtilEventSource, type EventSource } from "../../../db/models/event-source";
import type { EventEnvelope } from "../../../db/models/event-envelope";
import { EnvelopeErrorBadge } from "./envelope/EnvelopeErrorBadge";
import { UtilTranslations } from "@evnt/schema/utils";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const loaderTransition: MantineTransition = {
	in: { opacity: 1, width: "1.5rem" },
	out: { opacity: 0, width: "0" },
	transitionProperty: "opacity, width",
} as const;

const loadingTextTransition: MantineTransition = {
	in: { opacity: 1, height: "1rem", marginLeft: "1.5rem" },
	out: { opacity: 0, height: "0", marginLeft: "0" },
	transitionProperty: "opacity, height, margin-left",
} as const;

export interface EventCardProps extends Omit<EventEnvelope, "draft"> {
	variant?: "horizontal" | "card" | "inline";
	source?: EventSource;
	menu?: React.ReactNode;
	loading?: boolean;
	isDraft?: boolean;
	embed?: boolean;
};

export const EventCard = (props: EventCardProps) => {
	return (
		<Paper
			p={props.variant == "inline" ? 0 : "xs"}
			px={props.variant == "inline" ? 1 : undefined}
			withBorder
			w="100%"
			h={props.variant === "card" ? "100%" : undefined}
			shadow="xs"
		>
			<Stack gap={4} h="100%" justify="space-between">
				<Stack>
					<EventCardTitle {...props} />

					{props.variant === "card" && !!props.data && (
						<EventInstanceList value={props.data} />
					)}
				</Stack>

				{/* Bottom section */}
				{props.variant === "card" && (
					<Stack>
						<Group>
							{props.source && UtilEventSource.getType(props.source) === "local" && (
								<Badge color="gray" size="xs" variant="outline" children="local" />
							)}
							{props.source && UtilEventSource.getType(props.source) === "at" && (
								<Badge color="blue" size="xs" variant="outline" children="atproto" />
							)}
							{props.isDraft && (
								<Badge color="yellow" size="xs" variant="outline" children="draft" />
							)}
						</Group>
					</Stack>
				)}
			</Stack>
		</Paper>
	);
};

export const EventCardTitle = ({
	data,
	err,
	loading,
	source,
	menu,
	embed,
	variant,
}: EventCardProps) => {
	const { key } = useEventDetailsModal();

	let title: ReactNode = <Text inherit inline span c="dimmed" fz="sm" fs="italic" children="<no title>" />;
	if (!!err) title = <Text inherit inline span c="dimmed" fz="sm" fs="italic" children="<unknown>" />;
	else if (!!loading) title = <Skeleton height="1rem" width="16ch" />;

	if (!!data && !UtilTranslations.isEmpty(data.name))
		title = <Trans t={data.name} />;
	else if (!!data)
		title = <Text inherit inline span c="dimmed" fz="sm" fs="italic" children="<no title>" />;

	return (
		<Group
			align="start"
			fz={variant === "inline" ? "xs" : undefined}
		>
			<Stack gap={0} flex="1">
				<Group gap={4} align="center">
					<Group gap={0} align="center" wrap="nowrap">
						<Transition
							mounted={!!loading}
							transition={loaderTransition}
						>
							{(styles) => <Loader size="xs" style={styles} />}
						</Transition>
						<Anchor
							c="unset"
							inherit
							renderRoot={(props) => (
								<Link
									to="."
									search={(old) => ({ ...old, [key]: source })}
									target={embed ? "_blank" : undefined}
									{...props}
								/>
							)}
						>
							<Text
								fw={variant == "inline" ? undefined : "bold"}
								inherit
								span
								style={variant == "inline" ? {
									whiteSpace: "pre",
									textOverflow: "clip",
									overflow: "hidden",
								} : undefined}
							>
								{title}
							</Text>
						</Anchor>
					</Group>
					<EnvelopeErrorBadge err={err} />
				</Group>
				{variant !== "inline" && (
					<>
						<Text fz="sm" c="dimmed" inline span>
							{(!!data && "label" in data && data.label) && (
								<Trans t={data.label} />
							)}
						</Text>
						<Transition
							mounted={!data && !!loading}
							transition={loadingTextTransition}
						>
							{(styles) => (
								<Text style={styles} fz="xs" c="dimmed" fs="italic">loading...</Text>
							)}
						</Transition>
					</>
				)}
			</Stack>
			{menu}
		</Group>
	);
};

import { Badge, Group, Loader, Paper, Skeleton, Stack, Text, Transition, type MantineTransition } from "@mantine/core";
import { Trans } from "./Trans";
import { EventInstanceList } from "./EventInstanceList";
import { SubtleLink } from "../base/SubtleLink";
import { useEventDetailsModal } from "../../../hooks/app/useEventDetailsModal";
import { UtilEventSource, type EventSource } from "../../../db/models/event-source";
import type { EventEnvelope } from "../../../db/models/event-envelope";
import { EnvelopeErrorBadge } from "./envelope/EnvelopeErrorBadge";
import { UtilTranslations } from "@evnt/schema/utils";

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

export const EventCard = ({
	variant = "card",
	data,
	menu,
	source,
	err,
	loading,
}: {
	variant?: "horizontal" | "card";
	source?: EventSource;
	menu?: React.ReactNode;
	loading?: boolean;
} & EventEnvelope) => {
	const { openLink } = useEventDetailsModal();

	return (
		<Paper
			p="xs"
			withBorder
			w="100%"
			h={variant === "card" ? "100%" : undefined}
		>
			<Stack gap={4} h="100%" justify="space-between">
				<Stack>
					<Group align="start">
						<Stack gap={0} flex="1">
							<Group gap={4} align="center">
								<Group gap={0} align="center">
									<Transition
										mounted={!!loading}
										transition={loaderTransition}
									>
										{(styles) => <Loader size="xs" style={styles} />}
									</Transition>
									<SubtleLink if={!!source} to={openLink(source!)}>
										<Text fw="bold" span>
											{!!data ? (
												UtilTranslations.isEmpty(data.name) ? (
													<Text span c="dimmed" fz="sm" fs="italic" children="<no title>" />
												) : (
													<Trans t={data?.name} />
												)
											) : !!loading ? (
												<Skeleton height="1rem" width="16ch" />
											) : !!err ? (
												<Text span c="dimmed" fz="sm" fs="italic" children="<unknown>" />
											) : (
												<Text span c="dimmed" fz="sm" fs="italic" children="<no title>" />
											)}
										</Text>
									</SubtleLink>
								</Group>
								<EnvelopeErrorBadge err={err} />
							</Group>
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
						</Stack>
						{menu}
					</Group>

					{variant === "card" && !!data && (
						<EventInstanceList value={data} />
					)}
				</Stack>
				
				{/* Bottom section */}
				<Stack>
					<Group>
						{source && UtilEventSource.getType(source) === "local" && (
							<Badge color="gray" size="xs" variant="outline" children="local" />
						)}
						{source && UtilEventSource.getType(source) === "at" && (
							<Badge color="blue" size="xs" variant="outline" children="atproto" />
						)}
					</Group>
				</Stack>
			</Stack>
		</Paper>
	);
};

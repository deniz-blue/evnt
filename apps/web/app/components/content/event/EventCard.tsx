import { Group, Paper, Stack, Text } from "@mantine/core";
import { Trans } from "./Trans";
import type { EventData } from "@evnt/schema";
import { EventInstanceList } from "./EventInstanceList";
import { SubtleLink } from "../base/SubtleLink";
import { useEventDetailsModal } from "../../../hooks/app/useEventDetailsModal";
import { type EventSource } from "../../../db/models/event-source";

export const EventCard = ({
	variant = "card",
	value,
	menu,
	source,
}: {
	variant?: "horizontal" | "card";
	value: EventData;
	source?: EventSource;
	menu?: React.ReactNode;
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
						<SubtleLink if={!!source} to={openLink(source!)}>
							<Text fw="bold" span>
								<Trans t={value.name} />
							</Text>
						</SubtleLink>
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

import { Badge, Button, Group, Stack } from "@mantine/core";
import { useEventCardContext } from "./event-card-context";
import { UtilEventSource } from "../../../../db/models/event-source";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useEventEnvelope } from "../event-envelope-context";

export const EventCardBottom = () => {
	const { source } = useEventCardContext();
	const { isDraft } = useEventEnvelope();

	return (
		<Stack>
			<Group gap={0} justify="space-between">
				<Group>
					{source && UtilEventSource.getType(source) === "local" && (
						<Badge color="gray" size="xs" variant="outline" children="local" />
					)}
					{source && UtilEventSource.getType(source) === "at" && (
						<Badge color="blue" size="xs" variant="outline" children="atproto" />
					)}
					{isDraft && (
						<Badge color="yellow" size="xs" variant="outline" children="draft" />
					)}
				</Group>
				<Group>
					{source && (
						<Button
							size="compact-sm"
							variant="light"
							rightSection={<IconArrowNarrowRight />}
							color="gray"
							renderRoot={(props) => (
								<Link
									to="/event"
									search={{ source }}
									{...props}
								/>
							)}
						>
							View
						</Button>
					)}
				</Group>
			</Group>
		</Stack>
	);
};

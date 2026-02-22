import { Box, Paper, Stack } from "@mantine/core";
import { EventInstanceList } from "../EventInstanceList";
import { type EventSource } from "../../../../db/models/event-source";
import type { EventEnvelope } from "../../../../db/models/event-envelope";
import { EventCardBottom } from "./EventCardBottom";
import { EventCardTitle } from "./EventCardTitle";
import { EventCardBackground } from "./EventCardBackground";
import { EventCardContext } from "./event-card-context";
import classes from "./event-card.module.css";

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
			pos="relative"
			style={{ overflow: "hidden" }}
			className={classes.card}
		>
			<EventCardContext value={props}>
				<EventCardBackground />
				<Box pos="relative" style={{ zIndex: 1 }} h="100%">
					<Stack gap={4} h="100%" justify="space-between">
						<Stack>
							<EventCardTitle />

							{props.variant === "card" && !!props.data && (
								<EventInstanceList value={props.data} />
							)}
						</Stack>

						{props.variant === "card" && (
							<EventCardBottom />
						)}
					</Stack>
				</Box>
			</EventCardContext>
		</Paper>
	);
};



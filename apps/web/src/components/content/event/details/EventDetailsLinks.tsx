import { Stack } from "@mantine/core";
import { SmallTitle } from "../../base/SmallTitle";
import { EventLinkButton } from "../components/EventLinkButton";
import { useEventEnvelope } from "../event-envelope-context";
import type { KnownEventComponent } from "@evnt/schema";

export const EventDetailsLinks = () => {
	const { data } = useEventEnvelope();

	return (
		<Stack gap={0} component="section">
			<SmallTitle padLeft>
				links
			</SmallTitle>
			<Stack gap={4}>
				{data?.components?.filter((component): component is KnownEventComponent & { type: "link" } => component.type == "link").map(x => x.data).map((link, index) => (
					<EventLinkButton key={index} value={link} />
				))}
			</Stack>
		</Stack>
	)
};

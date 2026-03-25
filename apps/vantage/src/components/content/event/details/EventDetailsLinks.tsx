import { Stack } from "@mantine/core";
import { SmallTitle } from "../../base/SmallTitle";
import { EventLinkButton } from "../link/EventLinkButton";
import { useEventEnvelope } from "../event-envelope-context";
import type { KnownEventComponent } from "@evnt/schema";

export const EventDetailsLinks = () => {
	const { data } = useEventEnvelope();

	const links = data?.components?.filter((component): component is KnownEventComponent & { type: "link" } => component.type == "link").map(x => x.data);

	if (!links || links.length === 0) return null;

	return (
		<Stack gap={0} component="section">
			<SmallTitle>
				links
			</SmallTitle>
			<Stack gap={4}>
				{links.map((link, index) => (
					<EventLinkButton key={index} value={link} />
				))}
			</Stack>
		</Stack>
	)
};

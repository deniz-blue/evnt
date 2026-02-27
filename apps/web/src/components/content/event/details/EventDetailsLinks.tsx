import { Stack } from "@mantine/core";
import { useEventDetailsContext } from "./event-details-context";
import { SmallTitle } from "../../base/SmallTitle";
import { EventLinkButton } from "../components/EventLinkButton";

export const EventDetailsLinks = () => {
	const { data } = useEventDetailsContext();

	return (
		<Stack gap={0}>
			<SmallTitle padLeft>
				links
			</SmallTitle>
			<Stack gap={4}>
				{data?.components?.filter(component => component.type == "link").map(x => x.data).map((link, index) => (
					<EventLinkButton key={index} value={link} />
				))}
			</Stack>
		</Stack>
	)
};

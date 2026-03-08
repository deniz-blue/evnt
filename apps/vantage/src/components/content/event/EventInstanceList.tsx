import { Group, Stack, Text } from "@mantine/core";
import { snippetEvent } from "@evnt/pretty";
import { Snippet } from "../Snippet";
import { useEventEnvelope } from "./event-envelope-context";

export const EventInstanceList = () => {
	const { data: value } = useEventEnvelope();

	if (!value) return null;

	const snippets = snippetEvent(value, {
		maxVenues: 3,
	});

	return (
		<Stack gap={4}>
			{snippets.map((snippet, index) => (
				<Snippet key={index} snippet={snippet} />
			))}
		</Stack>
	);
}

import { Group, Stack, Text } from "@mantine/core";
import { snippetEvent } from "@evnt/pretty";
import { Snippet } from "../Snippet";
import { useResolvedEvent } from "./event-envelope-context";

export const EventInstanceList = () => {
	const { data: value } = useResolvedEvent();

	if (!value) return null;

	const snippets = snippetEvent(value, {
		maxVenues: 3,
		maxInstances: 5,
		maxGroups: 5,
	});

	return (
		<Stack gap={4}>
			{snippets.map((snippet, index) => (
				<Snippet key={index} snippet={snippet} />
			))}
		</Stack>
	);
}

import { Anchor, Code, List, Text } from "@mantine/core";
import { Section } from "../Section";

export const ATProtoSection = () => {
	return (
		<Section title="ATProto">
			<Text>
				The Evnt format is compatible with <Anchor href="https://atproto.com" target="_blank" rel="noopener noreferrer">
					ATProto
				</Anchor>;
			</Text>
			<List>
				<List.Item>
					Collection: <Code>directory.evnt.event</Code>
				</List.Item>
				<List.Item>
					Lexicon: <Anchor href="https://github.com/deniz-blue/evnt/blob/main/event-data.lexicon.json" target="_blank" rel="noopener noreferrer">
						event-data.lexicon.json
					</Anchor> on GitHub. Lexicons do not support the neccesary features to fully represent the evnt schema, so this is a very rough approximation.
				</List.Item>
			</List>
			<Text>
				Currently the standard collection for events is the <Anchor component="a" href="https://github.com/lexicon-community/lexicon/blob/main/community/lexicon/calendar/event.json" target="_blank" rel="noopener noreferrer">
					<Code>community.lexicon.calendar.event</Code>
				</Anchor> lexicon. Unfortunately, Evnt is more complex so these two lexicons are not fully compatible.
			</Text>
			<Text>
				Applications wishing to support both lexicons can use the same TID and do conversion between the formats.
			</Text>
			<Text>
				The <Anchor component="a" href="https://github.com/lexicon-community/lexicon/blob/main/community/lexicon/calendar/event.json" target="_blank" rel="noopener noreferrer">
					<Code>community.lexicon.calendar.rsvp</Code>
				</Anchor> lexicons can be used for RSVPs since <Code>subject</Code> field is a <Code>com.atproto.repo.strongRef</Code> and allows referencing the event in the <Code>directory.evnt.event</Code> collection.
			</Text>
		</Section>
	);
};
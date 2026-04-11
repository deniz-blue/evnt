import { Anchor, Button, Code, Group, List, Text } from "@mantine/core";
import { Section } from "../Section";
import { IconExternalLink } from "@tabler/icons-react";

export const ATProtoSection = () => {
	return (
		<Section title="ATProto">
			<Text>
				The Evnt format is compatible with <Anchor href="https://atproto.com" target="_blank" rel="noopener noreferrer">
					ATProto
				</Anchor>.
			</Text>
			<Text>
				Applications should use the <Code>directory.evnt.event</Code> collection for events.
			</Text>
			<Text>
				You can find the lexicons below! Keep in mind that <Code>Translations</Code> type is not supported in lexicons so they are marked as <Code>unknown</Code> in the lexicon.
			</Text>
			<Group justify="center">
				<Button
					component="a"
					href="https://pds.ls/at://evnt.directory/com.atproto.lexicon.schema"
					target="_blank"
					rightSection={<IconExternalLink />}
					variant="light"
				>
					Lexicons on PDSls
				</Button>
				<Button
					component="a"
					href="https://github.com/openevnt/evnt/blob/main/lexicons/directory/evnt"
					target="_blank"
					rightSection={<IconExternalLink />}
					variant="light"
				>
					Lexicons on GitHub
				</Button>
			</Group>
			<Text>
				Currently the standard collection for events is the <Anchor component="a" href="https://github.com/lexicon-community/lexicon/blob/main/community/lexicon/calendar/event.json" target="_blank" rel="noopener noreferrer">
					<Code>community.lexicon.calendar.event</Code>
				</Anchor> lexicon. Open Evnt and the community lexicons are not fully compatible.
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
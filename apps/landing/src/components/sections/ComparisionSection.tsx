import { ScrollArea, Table, Text } from "@mantine/core";
import { Section } from "../Section"

export const ComparisionSection = () => {
	return (
		<Section title="Comparison">
			<Text>
				Here is a comparison table showing how Evnt compares to some other event formats:
			</Text>

			<ScrollArea.Autosize scrollbars="x" offsetScrollbars>
				<Table
					data={{
						head: [
							"Feature",
							"Evnt",
							"iCAL",
							"Lexicon Community",
						],
						body: [
							[
								"Multiple Venues",
								"✅️",
								"❌️",
								"✅️",
							],
							[
								"Multiple Instances",
								"✅️",
								"❌️",
								"❌️",
							],
							[
								"Event Status",
								"✅️",
								"❌️",
								"✅️",
							],
							[
								"Multiple Links",
								"✅️",
								"❌️",
								"✅️",
							],
							[
								"Custom Metadata",
								"✅️",
								"❓️",
								"❓️",
							],
							[
								"Recurrence Rules",
								"❌️",
								"✅️",
								"❌️",
							],
							[
								"RSVP",
								"❌️",
								"✅️",
								"✅️",
							],
							[
								"Attendee/Organizer",
								"❌️",
								"✅️",
								"✅️",
							],
							[
								"Other (Task, Journal)",
								"❌️",
								"✅️",
								"❌️",
							],
							[
								"Free/Busy",
								"❌️",
								"✅️",
								"❌️",
							],
							[
								"i18n",
								"✅️",
								"❌️",
								"❌️",
							],
							[
								"Splash Media",
								"✅️",
								"❌️",
								"❌️",
							],
						],
					}}
				/>
			</ScrollArea.Autosize>
			<Text>
				We don't want to overrate our own format so feel free to point out things to add here.
			</Text>
		</Section>
	);
}
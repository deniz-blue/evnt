import type { SnippetLabelProps } from "@evnt/pretty";
import { Text, VisuallyHidden } from "@mantine/core";
import { TimeSnippetLabel } from "./TimeSnippetLabel";

export const TimeRangeSnippetLabel = ({ value }: SnippetLabelProps<"time-range">) => {
	return (
		<Text
			span
			inline
			inherit
			role="group"
			aria-label={`${value.start.value} to ${value.end.value}`}
			aria-roledescription="Time range"
		>
			<TimeSnippetLabel
				value={value.start.value}
				day={value.start.day}
			/>
			<Text
				span
				inline
				inherit
				c="dimmed"
				children=" – "
				aria-hidden
			/>
			<TimeSnippetLabel
				value={value.end.value}
				day={value.end.day}
			/>
		</Text>
	)
};

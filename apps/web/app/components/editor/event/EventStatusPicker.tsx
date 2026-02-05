import { EventStatusSchema, type EventStatus } from "@evnt/schema";
import { Group, Select, Stack, Text, type SelectProps } from "@mantine/core";
import { IconCalendarCheck, IconCalendarOff, IconCalendarPause, IconCalendarQuestion, IconCalendarTime, IconCheck, type TablerIcon } from "@tabler/icons-react";
import { useCallback } from "react";

export const EventStatusPicker = ({
	value,
	onChange,
	...props
}: {
	value: EventStatus;
	onChange: (value: EventStatus) => void;
} & Omit<SelectProps, "value" | "onChange">) => {
	const iconProps = {
		stroke: 1.5,
		color: 'currentColor',
		opacity: 0.6,
	};

	const icons: Record<EventStatus, TablerIcon> = {
		planned: IconCalendarCheck,
		cancelled: IconCalendarOff,
		postponed: IconCalendarTime,
		suspended: IconCalendarPause,
		uncertain: IconCalendarQuestion,
	};

	const renderOption: SelectProps["renderOption"] = useCallback(({ option, checked }) => {
		const Icon = icons[option.value as EventStatus];

		return (
			<Group flex="1" gap="xs" wrap="nowrap">
				<Icon {...iconProps} />
				<Stack gap={4}>
					<Text span inherit inline>
						{option.label[0]?.toUpperCase() + option.label.slice(1)}
					</Text>
					<Text span fz="xs" c="dimmed" inherit inline>
						{EventStatusSchema.options.find(status => status.value === option.value)?.description}
					</Text>
				</Stack>
				{checked && <IconCheck style={{ marginInlineStart: 'auto' }} {...iconProps} />}
			</Group>
		);
	}, []);

	return (
		<Select
			value={value}
			onChange={(val) => onChange((val || "planned") as EventStatus)}
			clearable={value !== "planned"}
			data={EventStatusSchema.options.map((status) => status.value)}
			renderOption={renderOption}
			comboboxProps={{
				width: "max-content",
			}}
			{...props}
		/>
	);
};

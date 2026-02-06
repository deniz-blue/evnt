import type { PartialDate } from "@evnt/schema";
import { UtilPartialDate } from "@evnt/schema/utils";
import { CloseButton, Group, Input, Popover, Stack, TextInput } from "@mantine/core";
import { Calendar, DatePicker, MonthLevel, MonthPicker, TimePicker, YearPicker, type CalendarLevel, type CalendarProps } from "@mantine/dates";
import { useEffect, useState, type ReactNode } from "react";
import { PartialDateSnippetLabel } from "../../content/datetime/PartialDateSnippetLabel";

export const PartialDateInput = ({
	value,
	onChange,
	onDelete,
	label,
}: {
	value: PartialDate;
	onChange: (value: PartialDate) => void;
	onDelete?: () => void;
	label?: ReactNode;
}) => {
	const levelOf = (v: PartialDate): CalendarLevel => UtilPartialDate.hasCompleteDate(v) ? "month" : UtilPartialDate.hasMonth(v) ? "year" : "decade";
	const asPartialDateDay = (v: PartialDate): PartialDate.Day => UtilPartialDate.toDate(value).toISOString().slice(0, 10) as PartialDate.Day;
	const [level, setLevel] = useState<CalendarLevel>(levelOf(value));
	const [date, setDate] = useState<string>(asPartialDateDay(value));

	const [inputValue, setInputValue] = useState<string>(value);
	useEffect(() => {
		setInputValue(value);
	}, [value]);

	// console.log("PartialDateInput render", { value, level, date });

	const onInputChange = (v: string) => {
		setInputValue(v);
		if (UtilPartialDate.validate(v)) {
			onChange(v);
			setDate(asPartialDateDay(v));
			setLevel(levelOf(v));
		};
	};

	const onDateChange = (v: string | null) => {
		if (!v) return;
		console.log("Date change", level, v);

		// if (level === "decade") onChange(v.slice(0, 4) as PartialDate.Year);
		// else if (level === "year") onChange(v.slice(0, 7) as PartialDate.Month);
		// else if (level === "month") onChange(v as PartialDate.Day);

		setDate(v);
	};

	const onValueChange = (v: string | null) => {
		if (!v) return;
		console.log("Value change", level, v);

		if (level === "decade") {
			onChange(v.slice(0, 4) as PartialDate.Year);
			setLevel("year");
		} else if (level === "year") {
			onChange(v.slice(0, 7) as PartialDate.Month);
			setLevel("month");
		} else if (level === "month") {
			onChange(v as PartialDate.Day);
		}
	};

	const onLevelChange = (newLevel: CalendarLevel) => {
		console.log("Level change to", level, "->", newLevel);
		// setLevel(newLevel);

		if (newLevel === "decade") {
			onChange(value.slice(0, 4) as PartialDate.Year);
			setLevel("decade");
		} else if (newLevel === "year") {
			onChange(value.slice(0, 7) as PartialDate.Month);
			setLevel("year");
		} else if (newLevel === "month") {
			setLevel("month");
		}
	};

	return (
		<Stack>
			<Popover position="bottom" withArrow>
				<Popover.Target>
					<Stack gap={0}>
						<TextInput
							value={inputValue}
							onChange={(e) => onInputChange(e.currentTarget.value)}
							error={inputValue.length > 0 && !UtilPartialDate.validate(inputValue) ? "Invalid date format" : undefined}
							label={label}
							rightSection={onDelete && (
								<CloseButton
									onClick={onDelete}
								/>
							)}
						/>
						<Input.Description>
							<PartialDateSnippetLabel
								value={value}
							/>
							{" (localized)"}
						</Input.Description>
					</Stack>
				</Popover.Target>
				<Popover.Dropdown>
					<Stack>
						{level === "decade" && (
							<YearPicker
								date={date}
								onDateChange={onDateChange}
								onChange={onValueChange}
							/>
						)}
						{level === "year" && (
							<MonthPicker
								date={date}
								onDateChange={onDateChange}
								onChange={onValueChange}
								level="year"
								onLevelChange={onLevelChange}
							/>
						)}
						{level === "month" && (
							<DatePicker
								level="month"
								date={date}
								value={value}
								highlightToday
								onDateChange={onDateChange}
								onChange={onValueChange}
								onLevelChange={onLevelChange}
							/>
						)}

						{UtilPartialDate.hasCompleteDate(value) && (
							<Group>
								<TimePicker
									format="24h"
									value={UtilPartialDate.getTimePart(value) || ""}
									clearable
									onChange={(time) => {
										onChange(UtilPartialDate.getDatePart(value) + (time ? `T${time}` : "") as PartialDate.Full | PartialDate.Day);
									}}
									label="Time (UTC)"
									style={{ flex: 1 }}
								/>
							</Group>
						)}
					</Stack>
				</Popover.Dropdown>
			</Popover>
		</Stack>
	);
};

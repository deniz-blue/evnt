import { Collapse, Combobox, Paper, ScrollArea, Stack, TextInput, useCombobox } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState, type ReactNode } from "react";

export const OsuSelect = ({
	value,
	onChange,
	options,
}: {
	value: string;
	onChange: (value: string) => void;
	options?: { label?: ReactNode; value: string; }[];
}) => {
	const [search, setSearch] = useState(value);
	const [dropdownOpened, { open, close }] = useDisclosure();

	const combobox = useCombobox({});

	const isValid = options?.some((option) => option.value === value);
	const filteredOptions = isValid ? options : options?.filter((option) =>
		option.value.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<Combobox store={combobox} onOptionSubmit={(v) => {
			onChange(v);
		}}>
			<Stack gap={4}>
				<Combobox.EventsTarget>
					<TextInput
						value={search}
						onChange={(event) => setSearch(event.currentTarget.value)}
						autoComplete="off"
						onFocus={open}
						onBlur={close}
						placeholder="Select option..."
					/>
				</Combobox.EventsTarget>
				<Collapse in={dropdownOpened}>
					<Paper withBorder>
						<ScrollArea.Autosize mah={200}>
							<Combobox.Options>
								{filteredOptions?.map((option) => (
									<Combobox.Option key={option.value} value={option.value}>
										{option.label ?? option.value}
									</Combobox.Option>
								))}
							</Combobox.Options>
						</ScrollArea.Autosize>
					</Paper>
				</Collapse>
			</Stack>
		</Combobox>
	);
};

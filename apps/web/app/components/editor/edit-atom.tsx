import { Box, Button, CloseButton, Group, type ButtonProps } from "@mantine/core";
import { useAtom, type WritableAtom } from "jotai";
import type { ReactNode } from "react";

export type EditAtom<T> = WritableAtom<T, [T | ((prev: T) => T)], void>;

export const Deatom = <Data, Props,>({
	atom,
	component: Component,
	...props
}: Omit<Props, "value" | "onChange"> & {
	component: React.ComponentType<Props & { value: Data; onChange: (value: Data) => void }>;
	atom: EditAtom<Data>;
}) => {
	const [value, onChange] = useAtom(atom);
	return <Component {...(props as Props)} value={value} onChange={onChange} />;
};

export interface DeatomableComponentProps<Data> {
	value: Data;
	onChange: (value: Data) => void;
	onDelete: () => void;
};

export const DeatomOptional = <Data, Props>({
	atom,
	component: Component,
	set,
	setLabel = "Set",
	setButtonProps,
	withDeleteButton = true,
	...props
}: Omit<Props, keyof DeatomableComponentProps<Data> | "set"> & {
	component: React.ComponentType<Props & DeatomableComponentProps<Data>>;
	atom: EditAtom<Data | undefined>;
	set: Data | (() => Data);
	setLabel?: ReactNode;
	setButtonProps?: Omit<ButtonProps, "onClick">;
	withDeleteButton?: boolean;
}) => {
	const [value, onChange] = useAtom(atom);

	if (value === undefined) {
		return (
			<Button
				onClick={() => onChange(typeof set === "function" ? (set as () => Data)() : set)}
				{...setButtonProps}
			>
				{setLabel}
			</Button>
		);
	}

	return (
		<Group flex="1" gap={4}>
			<Box flex="1">
				<Component {...(props as unknown as Props)} value={value} onChange={onChange} onDelete={() => onChange(undefined as Data)} />
			</Box>
			{withDeleteButton && <CloseButton onClick={() => onChange(undefined as Data)} />}
		</Group>
	);
};


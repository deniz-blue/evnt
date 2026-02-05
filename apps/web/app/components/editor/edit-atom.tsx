import { Box, Button, CloseButton, Group } from "@mantine/core";
import { useAtom, type WritableAtom } from "jotai";

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

export const DeatomOptional = <Data, Props>({
	atom,
	component: Component,
	set,
	...props
}: Omit<Props, "value" | "onChange" | "onDelete" | "set"> & {
	component: React.ComponentType<Props & { value: Data; onChange: (value: Data) => void; onDelete: () => void }>;
	atom: EditAtom<Data | undefined>;
	set: Data | (() => Data);
}) => {
	const [value, onChange] = useAtom(atom);

	if (value === undefined) {
		return (
			<Button
				onClick={() => onChange(typeof set === "function" ? (set as () => Data)() : set)}
			>
				Set
			</Button>
		);
	}

	return (
		<Group flex="1" gap={4}>
			<Box flex="1">
				<Component {...(props as Props)} value={value} onChange={onChange} onDelete={() => onChange(undefined as Data)} />
			</Box>
			<CloseButton onClick={() => onChange(undefined as Data)} />
		</Group>
	);
};


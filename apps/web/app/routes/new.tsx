import { Container, JsonInput } from "@mantine/core";
import { EditEvent } from "../components/editor/event/EditEvent";
import { useMemo } from "react";
import type { EventData } from "@evnt/schema";
import { atom, useAtom } from "jotai";

export default function NewEventPage() {
	const dataAtom = useMemo(() => atom<EventData>({ v: 0, name: {} }), []);

	// type WSetAction<T> = W<T> | ((prev: W<T>) => W<T>) | typeof RESET;
	// type WAtom<T> = WritableAtom<W<T>, [WSetAction<T>], void>;
	// type NonFunction<T> = [T] extends [(...args: any[]) => any] ? never : T;
	// const wrap = <S extends object, R>(valueAtom: WritableAtom<S, unknown[], R>, initial: S): WAtom<S> => {
	// 	const anAtom = atom(
	// 		(get) => ({
	// 			value: get(valueAtom),
	// 			initial,
	// 			dirty: false,
	// 			focus: <A,>(optic: Parameters<typeof focusAtom<S, any[], R>>[1]) => wrap(focusAtom(valueAtom, optic), O.get(optic)(initial)),
	// 		}),
	// 		(get, set, update) => {
	// 			if (update === RESET) {
	// 				set(valueAtom, initial);
	// 				return;
	// 			}

	// 			const newState = typeof update === "function" ? update(get(anAtom)) : update;
	// 			set(valueAtom, newState.value);
	// 		},
	// 	);
	// 	return anAtom;
	// };

	// const wAtom = wrap(atom((get) => get(dataAtom), (set) => set(dataAtom, RESET)), { v: 0, name: {} });

	const [data] = useAtom(dataAtom);

	return (
		<Container>
			<EditEvent
				data={dataAtom}
			/>

			<JsonInput
				label="Form Values (for debugging)"
				value={JSON.stringify(data, null, 2)}
				autosize
				readOnly
				mt="md"
			/>
		</Container>
	);
};

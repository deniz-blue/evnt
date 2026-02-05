import type { EventData } from "@evnt/schema";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface EventFormState {
	data: EventData;
}

export interface EventFormActions {
	setData: (data: Partial<EventData>) => void;
}

export const useEventFormStore = create<EventFormState & EventFormActions>()(
	immer((set) => ({
		data: { v: 0, name: {} },
		setData: (data: Partial<EventData>) =>
			set((state) => {
				state.data = { ...state.data, ...data };
			}),
	}))
);

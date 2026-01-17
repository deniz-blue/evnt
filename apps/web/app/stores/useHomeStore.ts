import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { LOCALSTORAGE_KEYS } from "../constants";
import { UtilEventSource, type EventDataSource } from "../db/models/event-source";

interface HomeState {
	pinnedEvents: EventDataSource[];
}

interface HomeActions {
	pinEvent: (source: EventDataSource) => void;
	unpinEvent: (source: EventDataSource) => void;
}

export const useHomeStore = create<HomeState & HomeActions>()(
	persist(
		immer((set) => ({
			pinnedEvents: [],
			pinEvent: (source: EventDataSource) => set((state) => {
				if (!state.pinnedEvents.includes(source)) {
					state.pinnedEvents.push(source);
				}
			}),
			unpinEvent: (source: EventDataSource) => set((state) => {
				const index = state.pinnedEvents.findIndex((e) =>
					UtilEventSource.equals(e, source)
				);
				if (index === -1) return;
				state.pinnedEvents.splice(index, 1);
			}),
		})),
		{
			name: LOCALSTORAGE_KEYS.home,
			version: 1,
		}
	),
);

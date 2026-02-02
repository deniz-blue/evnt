import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { LOCALSTORAGE_KEYS } from "../constants";
import { UtilEventSource, type EventSource } from "../db/models/event-source";

interface HomeState {
	pinnedEvents: EventSource[];
}

interface HomeActions {
	pinEvent: (source: EventSource) => void;
	unpinEvent: (source: EventSource) => void;
}

export const useHomeStore = create<HomeState & HomeActions>()(
	persist(
		immer((set) => ({
			pinnedEvents: [],
			pinEvent: (source: EventSource) => set((state) => {
				if (!state.pinnedEvents.includes(source)) {
					state.pinnedEvents.push(source);
				}
			}),
			unpinEvent: (source: EventSource) => set((state) => {
				const index = state.pinnedEvents.findIndex((e) => e == source);
				if (index === -1) return;
				state.pinnedEvents.splice(index, 1);
			}),
		})),
		{
			name: LOCALSTORAGE_KEYS.home,
			version: 2,
			migrate: (persistedState: any, version) => {
				if (version === 1) {
					return {
						...persistedState,
						pinnedEvents: (persistedState.pinnedEvents as ({
							type: "local";
							uuid: string;
						} | {
							type: "remote";
							url: string;
						})[]).map((source) =>
							UtilEventSource.fromOld(source)
						),
					};
				}
				return persistedState;
			},
		},
	),
);

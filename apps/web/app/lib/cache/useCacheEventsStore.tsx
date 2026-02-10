import { create } from "zustand";
import type { EventSource } from "../../db/models/event-source";
import type { EventData, PartialDate } from "@evnt/schema";
import { immer } from "zustand/middleware/immer";
import { DataDB } from "../../db/data-db";

export interface CacheEventsStore {
	cacheByPartialDate: Record<PartialDate, EventSource[]>;

	hydrateSource: (source: EventSource) => Promise<void>;
	hydrate: (source: EventSource, data: EventData) => void;
	init: () => Promise<void>;
};

export const useCacheEventsStore = create<CacheEventsStore>()(
	immer((set, get) => ({
		cacheByPartialDate: {},

		hydrateSource: async (source: EventSource) => {
			const data = await DataDB.get(source);
			if (data?.data) {
				get().hydrate(source, data.data);
			}
		},

		hydrate: (source: EventSource, data: EventData) => set((state) => {
			for (const instance of data.instances || []) {
				for (const key of ["start", "end"] as const) {
					if (instance[key]) state.cacheByPartialDate[instance[key]] = Array.from(new Set([...(state.cacheByPartialDate[instance[key]] || []), source]));
				}
			}
		}),

		init: async () => {
			const all = await DataDB.getAllKeys();
			const { hydrate } = get();
			for (const source of all) {
				const data = await DataDB.get(source);
				if (data?.data) {
					hydrate(source, data.data);
				}
			}
		},
	}))
);

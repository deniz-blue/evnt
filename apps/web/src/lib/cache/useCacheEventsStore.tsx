import { create } from "zustand";
import type { EventSource } from "../../db/models/event-source";
import type { EventData, PartialDate } from "@evnt/schema";
import { immer } from "zustand/middleware/immer";
import { DataDB } from "../../db/data-db";
import { useLayersStore } from "../../db/useLayersStore";
import { UtilPartialDate } from "@evnt/schema/utils";

export interface CacheEventsStore {
	cache: {
		byPartialDate: Record<PartialDate, EventSource[]>;
		byMonth: Record<PartialDate.Month, EventSource[]>;
		byDay: Record<PartialDate.Day, EventSource[]>;
	};

	hydrateSource: (source: EventSource) => Promise<void>;
	hydrate: (source: EventSource, data: EventData) => void;
	init: () => Promise<void>;
};

export const useCacheEventsStore = create<CacheEventsStore>()(
	immer((set, get) => ({
		cache: {
			byPartialDate: {},
			byMonth: {},
			byDay: {},
		},

		hydrateSource: async (source: EventSource) => {
			const data = await DataDB.get(source);
			if (data?.data) {
				get().hydrate(source, data.data);
			}
		},

		hydrate: (source: EventSource, data: EventData) => set((state) => {
			for (const instance of data.instances || []) {
				for (const key of ["start", "end"] as const) {
					const partialDate = instance[key];
					if (!partialDate) continue;

					state.cache.byPartialDate[partialDate] ||= [];
					if (!state.cache.byPartialDate[partialDate].includes(source))
						state.cache.byPartialDate[partialDate].push(source);

					if (UtilPartialDate.hasMonth(partialDate)) {
						const month = UtilPartialDate.asMonth(partialDate);
						state.cache.byMonth[month] ||= [];
						if (!state.cache.byMonth[month].includes(source))
							state.cache.byMonth[month].push(source);
					}

					if (UtilPartialDate.hasDay(partialDate)) {
						const day = UtilPartialDate.asDay(partialDate);
						state.cache.byDay[day] ||= [];
						if (!state.cache.byDay[day].includes(source))
							state.cache.byDay[day].push(source);
					}
				}
			}
		}),

		init: async () => {
			console.time("Cache initialization...");
			const all = useLayersStore.getState().allTrackedSources();
			const { hydrate } = get();
			for (const source of all) {
				const data = await DataDB.get(source);
				if (data?.data) {
					hydrate(source, data.data);
				}
			}
			console.timeEnd("Cache initialization...");
		},
	}))
);

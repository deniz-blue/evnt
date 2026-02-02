import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { LOCALSTORAGE_KEYS } from "../constants";
import type { Layer } from "./models/layer";
import { UtilEventSource, type EventSource } from "./models/event-source";

export interface LayersState {
	layers: Record<string, Layer>;
};

export interface LayersActions {
	addLayer: (id: string, layer: Layer) => void;
	updateLayer: (id: string, layer: Partial<Layer>) => void;
	removeLayer: (id: string) => void;

	addEventSource: (source: EventSource, layerId?: string) => void;
	removeEventSource: (source: EventSource, layerId?: string) => void;
};

export type LayersStore = LayersState & LayersActions;

export const useLayersStore = create<LayersStore>()(
	persist(
		immer((set, get) => ({
			layers: {
				default: { data: { events: [] } },
			},

			addLayer: (id: string, layer: Layer) =>
				set((state) => {
					state.layers[id] = layer;
				}),

			updateLayer: (id: string, layer: Partial<Layer>) =>
				set((state) => {
					if (state.layers[id]) {
						state.layers[id] = {
							...state.layers[id],
							...layer,
						};
					}
				}),

			removeLayer: (id: string) =>
				set((state) => {
					delete state.layers[id];
				}),

			addEventSource: (source: EventSource, layerId = "default") =>
				set((state) => {
					if (!state.layers[layerId]) {
						state.layers[layerId] = { data: { events: [] } };
					}
					state.layers[layerId].data.events.push(source);
				}),

			removeEventSource: (source: EventSource, layerId = "default") =>
				set((state) => {
					if (!state.layers[layerId]) return;
					const index = state.layers[layerId].data.events.findIndex((e) => e === source);
					if (index === -1) return;
					state.layers[layerId].data.events.splice(index, 1);
				}),
		})),
		{
			name: LOCALSTORAGE_KEYS.layers,
			version: 2,
			migrate(persistedState: any, version) {
				if (version < 2) {
					const newLayers: Record<string, Layer> = {};
					for (const [layerId, layer] of Object.entries(persistedState.layers)) {
						const newEvents: EventSource[] = (layer as any).data.events.map((source: any) =>
							UtilEventSource.fromOld(source));
						newLayers[layerId] = {
							data: {
								events: newEvents,
							},
						};
					}
					return {
						layers: newLayers,
					};
				} else {
					return persistedState;
				}
			},
		},
	),
);

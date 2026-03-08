import type { EventSource } from "./event-source";

export interface LayerData {
	events: EventSource[];
};

export interface Layer {
	data: LayerData;
};

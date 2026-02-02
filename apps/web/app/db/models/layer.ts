import type { EventDataSource } from "./event-source";

export interface LayerData {
	events: EventDataSource[];
};

export interface Layer {
	data: LayerData;
};

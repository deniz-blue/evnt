import type { EventData } from "@evnt/schema";
import { useLayersStore } from "../../db/useLayersStore";
import { UtilEventSource, type EventSource } from "../../db/models/event-source";
import { DataDB } from "../../db/data-db";
import { useTasksStore } from "../../stores/useTasksStore";

export class EventActions {
	static async createLocalEvent(data: EventData, layerId?: string) {
		useTasksStore.getState().addTask({
			title: "Creating local event",
			notify: true,
		}, async () => {
			const source = UtilEventSource.localRandom();
			await DataDB.put(source, { data });
			useLayersStore.getState().addEventSource(source, layerId);
		});
	}

	static async createEventFromSource(source: EventSource, layerId?: string) {
		useTasksStore.getState().addTask({
			title: "Creating event from source",
			notify: true,
		}, async () => {
			useLayersStore.getState().addEventSource(source, layerId);
		});
	}

	/// @deprecated
	static async createRemoteEventFromUrl(url: string, layerId?: string) {
		return this.createEventFromSource(UtilEventSource.as(url), layerId);
	}

	// @deprecated
	static async createRemoteEvent(url: string, data: EventData, layerId?: string) {
		this.createEventFromSource(UtilEventSource.as(url), layerId);
		await DataDB.put(UtilEventSource.as(url), { data });
	}

	static async deleteEvent(source: EventSource, layerId?: string) {
		useTasksStore.getState().addTask({
			title: "Deleting event from layer",
			notify: true,
		}, async () => {
			useLayersStore.getState().removeEventSource(source, layerId);
		});
	}
};

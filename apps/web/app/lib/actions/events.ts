import type { EventData } from "@evnt/schema";
import { useLayersStore } from "../../db/useLayersStore";
import { UtilEventSource, type EventDataSource } from "../../db/models/event-source";
import { DataDB } from "../../db/data-db";
import { useTasksStore } from "../../stores/useTasksStore";

export class EventActions {
	static async createLocalEvent(data: EventData, layerId?: string) {
		useTasksStore.getState().addTask({
			title: "Creating local event",
			notify: true,
		}, async () => {
			const source = UtilEventSource.newLocal();
			await DataDB.put(UtilEventSource.getKey(source), { data });
			useLayersStore.getState().addEventSource(source, layerId);
		});
	}

	static async createRemoteEventFromUrl(url: string, layerId?: string) {
		useTasksStore.getState().addTask({
			title: "Creating remote event from URL",
			notify: true,
		}, async () => {
			// TODO: validation
			const source = UtilEventSource.newRemote(url);
			useLayersStore.getState().addEventSource(source, layerId);
		});
	}

	static async createRemoteEvent(url: string, data: EventData, layerId?: string) {
		useTasksStore.getState().addTask({
			title: "Creating remote event",
			notify: true,
		}, async () => {
			const source = UtilEventSource.newRemote(url);
			await DataDB.put(UtilEventSource.getKey(source), { data });
			useLayersStore.getState().addEventSource(source, layerId);
			console.log("Created remote event:", source);
		});
	}

	static async deleteEvent(source: EventDataSource, layerId?: string) {
		useTasksStore.getState().addTask({
			title: "Deleting event from layer",
			notify: true,
		}, async () => {
			useLayersStore.getState().removeEventSource(source, layerId);
		});
	}
};

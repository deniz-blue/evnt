import type { EventData } from "@evnt/schema";
import { useLayersStore } from "./useLayersStore";
import { UtilEventSource } from "./models/event-source";
import { DataDB } from "./data-db";
import { useTasksStore } from "../stores/useTasksStore";

export class EventUtils {
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
};

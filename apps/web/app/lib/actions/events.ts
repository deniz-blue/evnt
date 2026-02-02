import type { EventData } from "@evnt/schema";
import { useLayersStore } from "../../db/useLayersStore";
import { UtilEventSource, type EventSource } from "../../db/models/event-source";
import { DataDB } from "../../db/data-db";
import { useTasksStore } from "../../stores/useTasksStore";
import { EVENT_REDIRECTOR_URL } from "../../constants";

export class EventActions {
	static async createLocalEvent(data: EventData, layerId?: string) {
		return await useTasksStore.getState().addTask({
			title: "Creating local event",
			notify: true,
		}, async () => {
			const source = UtilEventSource.localRandom();
			await DataDB.put(source, { data });
			useLayersStore.getState().addEventSource(source, layerId);
			return source;
		});
	}

	static async createEventFromSource(source: EventSource, layerId?: string) {
		return await useTasksStore.getState().addTask({
			title: "Creating event from source",
			notify: true,
		}, async () => {
			useLayersStore.getState().addEventSource(source, layerId);
			return source;
		});
	}

	static async deleteEvent(source: EventSource, layerId?: string) {
		return await useTasksStore.getState().addTask({
			title: "Deleting event from layer",
			notify: true,
		}, async () => {
			useLayersStore.getState().removeEventSource(source, layerId);
		});
	}

	static getShareLink(source: EventSource) {
		return `${EVENT_REDIRECTOR_URL}/?${new URLSearchParams({
			action: "view-event",
			url: source,
		}).toString()}`;
	}
};

import { DataDB } from "./data-db";
import { useLayersStore } from "./useLayersStore";

export class EventsGC {
	static async deleteUntracked() {
		const sources = useLayersStore.getState().allTrackedSources();
		const all = await DataDB.getAllKeys();
		const untracked = all.filter((source) => !sources.includes(source));
		console.log(`GC: Deleting ${untracked.length} untracked sources...`, untracked);
		await Promise.all(untracked.map((source) => DataDB.delete(source)));
		console.log(`GC: Deleted ${untracked.length} untracked sources.`);
	}
}

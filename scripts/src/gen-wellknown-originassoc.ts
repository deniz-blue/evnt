import { writeFileSync } from "node:fs";
import type { InstancesJson } from "./types";

export const genWellKnownOriginAssoc = async (data: InstancesJson, dest: string | URL) => {
	const json: Record<string, {}> = {};

	for (const instance of data.instances) {
		json[instance.url] = {};
	};

	writeFileSync(
		dest,
		JSON.stringify(json, null, 2),
	);
};

import data from "../../../data/instances.json" assert { type: "json" };
import { writeFileSync } from "node:fs";
import path from "node:path";

let json: Record<string, {}> = {};

for (const instance of data.instances) {
	json[instance.url] = {};
};

writeFileSync(
	path.join(import.meta.dirname, "..", "public", ".well-known", "web-app-origin-association"),
	JSON.stringify(json, null, 2),
);

#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import {
	build,
	indexhtml,
	indexjson,
} from "./index";
import { join } from "node:path";
import { readmelist } from "./tasks/readmelist";

const main = async () => {
	const dir = "./events";
	const out = "./dist";
	const entries = await build(dir, out);
	writeFileSync(join(out, "index.html"), indexhtml());
	writeFileSync(join(out, ".index.json"), JSON.stringify(indexjson(entries)));
	await readmelist(join(out, "README.md"), entries);
}

main();

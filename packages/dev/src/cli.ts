#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
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
	if (!existsSync(out)) mkdirSync(out);
	const entries = await build(dir, out);
	writeFileSync(join(out, "index.html"), indexhtml());
	writeFileSync(join(out, ".index.json"), JSON.stringify(indexjson(entries)));
	if (existsSync("README.md")) await readmelist("README.md", entries);
}

main();

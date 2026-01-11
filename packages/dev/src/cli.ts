#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import {
    build,
    indexhtml,
    indexjson,
} from "./index";
import { join } from "node:path";

const main = async () => {
    const dir = "./events";
    const out = "./dist";
    const entries = await build(dir, out);
    writeFileSync(join(out, "index.html"), indexhtml());
    writeFileSync(join(out, "index.json"), JSON.stringify(indexjson(entries)));
}

main();

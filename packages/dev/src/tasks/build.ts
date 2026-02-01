import { existsSync, fstatSync, globSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { validateJsonFile } from "./validate";
import { join } from "node:path";
import * as core from "@actions/core";
import { JSONParseError, SchemaValidationError } from "../errors";
import type { EventData } from "@evnt/schema";

export type EventEntry = {
    data: EventData;
    fullpath: string;
    relativepath: string;
	lastModified?: number;
};

export const lsfile = ".ls.json";

export const build = async (dir: string, out: string = "./dist") => {
    console.log(`Building events from ${dir} to ${out}...`);
    if(existsSync(out)) rmSync(out, { recursive: true });

    const files = globSync("**/*", {
        cwd: dir,
        exclude: ["node_modules/**", ".github/**", "dist/**", lsfile],
        withFileTypes: true,
    });

    const entries: EventEntry[] = [];

    let promises = [];
    for (const file of files) {
        promises.push((async () => {
            const path = join(file.parentPath, file.name);

            if (file.isDirectory()) {
                if(!existsSync(join(out, path))) mkdirSync(join(out, path), { recursive: true });
                writeFileSync(join(out, path, lsfile), JSON.stringify(readdirSync(path).filter(x => x !== lsfile)));
            } else {
                const content = readFileSync(path, "utf-8");
                const data = validateJsonFile(content, path);
                writeFileSync(join(out, path), JSON.stringify(data));
                entries.push({
					data,
					fullpath: path,
					relativepath: join(file.parentPath, file.name),
					lastModified: statSync(path).mtimeMs,
				});
                core.info(`Validated: ${data.name["en"] || data.name[Object.keys(data.name)[0] || "en"] || "<unnamed event>"}`);
            }
        })());
    }

    const all = await Promise.allSettled(promises);
    const errs = all.filter((x) => x.status === "rejected").map((x) => (x as PromiseRejectedResult).reason);
    if (errs.length > 0) {
        for (const err of errs) {
            if (err instanceof JSONParseError) {
                err.annotate();
                console.error(err.path);
                console.error(err.message);
            } else if (err instanceof SchemaValidationError) {
                err.annotate();
                console.error(err.getCodeFrames());
                console.error(err.prettify());
            } else {
                console.error(err);
            }
        }

        console.error(`Build failed with ${errs.length} error(s).`);
        core.setFailed(`Build failed with ${errs.length} error(s).`);
        process.exit(1);
    }

    return entries;
}

import { readdirSync, type PathLike } from "node:fs";
import { dirname } from "node:path";
import type { Command } from "./core/command";

export const importRecursive = async <T>(cwd: PathLike): Promise<T[]> => {
    const entries = readdirSync(cwd, { withFileTypes: true, recursive: true });
    const promises = entries.filter((x) => x.isFile()).map(x => {
        return import("file://" + x.parentPath + "/" + x.name);
    });
    const imports = await Promise.all(promises);
    return imports.map((mod) => mod.default as T);
};

const commandsDir = new URL(dirname(import.meta.url) + "/commands");
export const getCommands = () => {
    return importRecursive<Command>(commandsDir);
};

import * as schemas from "../src/index.js";
import { convertSchemas, formatModelsAsMarkdown } from 'zod2md';
//@ts-ignore
import { writeFileSync } from "node:fs";

const JSON_SCHEMA_PATH = new URL("../../../event-data.schema.json", import.meta.url);
const MD_PATH = new URL("../../../docs/SCHEMA.md", import.meta.url);

// Generate JSON Schema

const eventDataSchema = schemas.EventDataSchema.toJSONSchema();
writeFileSync(
    JSON_SCHEMA_PATH,
    JSON.stringify(eventDataSchema, null, 2)
);
console.log("Exported json schema");

// Generate MD documentation

const list = convertSchemas(
    Object.entries(schemas).map(([name, schema]) => ({
        name,
        schema,
        path: `schemas/${name}`,
    })),
);
list.sort((a, b) => (a.name||"").localeCompare(b.name||""));
// Put EventDataSchema first
const eventDataIndex = list.findIndex((m) => m.name === "EventDataSchema");
if (eventDataIndex !== -1) {
    const [eventDataModel] = list.splice(eventDataIndex, 1);
    list.unshift(eventDataModel);
}
writeFileSync(
    MD_PATH,
    formatModelsAsMarkdown(list, {
        title: "Event Data Schema",
    }),
);
console.log("Exported markdown");

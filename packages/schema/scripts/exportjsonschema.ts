import { EventDataSchema } from "../src/index.js";
//@ts-ignore
import { writeFileSync } from "node:fs";

const eventDataSchema = EventDataSchema.toJSONSchema();

writeFileSync(
    new URL("../../../event-data.schema.json", import.meta.url),
    JSON.stringify(eventDataSchema, null, 2)
);
console.log("Exported event-data.schema.json");

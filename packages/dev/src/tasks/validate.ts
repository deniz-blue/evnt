import { EventDataSchema } from "@evnt/schema";
import { JSONParseError, SchemaValidationError } from "../errors";
import { ZodError } from "zod";

export const validateJsonFile = (
    content: string,
    filePath: string,
) => {
    let json;
    try {
        json = JSON.parse(content);
    } catch (e) {
        throw new JSONParseError(filePath, e as SyntaxError);
    }

    const { success, error, data } = EventDataSchema.safeParse(json);
    if (!success) throw new SchemaValidationError(filePath, error as ZodError, content);
    return data;
};

import type { $ZodString } from "zod/v4/core";
import type { EditorComponent } from "../types";
import { TextInput } from "@mantine/core";
import z from "zod";

export const StringEditor: EditorComponent<$ZodString> = ({
    schema,
    value,
    onChange,
}) => {
    return (
        <TextInput
            description={z.globalRegistry.get(schema)?.description}
            value={""+value}
            onChange={(v) => onChange(v.currentTarget.value)}
        />
    )
};

import type { $ZodObject } from "zod/v4/core";
import type { EditorComponent } from "../types";
import { Input, Stack, Text } from "@mantine/core";
import { RecursiveEditor } from "../RecursiveEditor";

export const ObjectEditor: EditorComponent<$ZodObject> = ({
    schema,
    value,
    onChange,
}) => {
    return (
        <Stack gap={4}>
            {Object.entries(schema._zod.def.shape).map(([key, valueType]) => (
                <Stack gap={0} key={key} style={{
                    borderLeft: "4px solid var(--mantine-color-gray-7)",
                    paddingLeft: "8px",
                }}>
                    <Input.Label>
                        {key} ({valueType._zod.def.type})
                    </Input.Label>
                    <RecursiveEditor
                        schema={valueType}
                        value={value[key]}
                        onChange={(v) => onChange({ ...value, [key]: v })}
                    />
                </Stack>
            ))}
        </Stack>
    )
};

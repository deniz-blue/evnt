import type { $ZodRecord } from "zod/v4/core";
import { FormContext, type EditorComponent } from "../types";
import { Group, Stack, Text } from "@mantine/core";
import { RecursiveEditor } from "../RecursiveEditor";
import { useContext } from "react";

export const RecordEditor: EditorComponent<$ZodRecord> = ({
    schema,
    path,
}) => {
    const form = useContext(FormContext);
    const value = form.getInputProps(path).value as Record<string, any>;

    console.log("RecordEditor value at path", path, "is", value);

    return (
        <Stack>
            {Object.entries(value || {}).map(([k, v]) => (
                <Group grow key={k} gap={4}>
                    {/* TODO: wrap this in a smaller form or something idk */}
                    {/* <RecursiveEditor
                        schema={schema._zod.def.keyType}
                        path={`${path}.${k}keyyyyyy`}
                    /> */}
                    <RecursiveEditor
                        schema={schema._zod.def.valueType}
                        path={`${path}.${k}`}
                    />
                </Group>
            ))}
        </Stack>
    )
};

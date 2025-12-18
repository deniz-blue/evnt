import type { $ZodRecord } from "zod/v4/core";
import type { EditorComponent } from "../types";
import { Group, Stack, Text } from "@mantine/core";
import { RecursiveEditor } from "../RecursiveEditor";

export const RecordEditor: EditorComponent<$ZodRecord> = ({
    schema,
    value,
    onChange,
}) => {
    return (
        <Stack>
            {Object.entries(value).map(([k, v]) => (
                <Group grow key={k} gap={4}>
                    <RecursiveEditor
                        value={k}
                        onChange={(newK) => {}}
                        schema={schema._zod.def.keyType}
                    />
                    <RecursiveEditor
                        value={v}
                        onChange={(newV) => {}}
                        schema={schema._zod.def.valueType}
                    />
                </Group>
            ))}
        </Stack>
    )
};

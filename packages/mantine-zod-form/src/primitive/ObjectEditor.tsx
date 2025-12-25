import type { $ZodObject } from "zod/v4/core";
import type { EditorComponent } from "../types";
import { Avatar, Group, Input, Stack, Text } from "@mantine/core";
import { RecursiveEditor } from "../RecursiveEditor";
import { IconBraces } from "@tabler/icons-react";
import z from "zod";

export const ObjectEditor: EditorComponent<$ZodObject> = ({
    schema,
    path,
}) => {
    const currentKey = path.split(".").pop() || "";
    return (
        <Stack gap={0}>
            <Group wrap="nowrap" gap={4} align="start">
                <IconBraces />
                <Stack gap={0}>
                    <Text fw={500} inline span>{currentKey || "Root"}</Text>
                    <Text size="sm" c="dimmed" inline span>
                        {z.globalRegistry.get(schema)?.description}
                    </Text>
                </Stack>
            </Group>
            <Stack className="mzf-parent">
                {Object.entries(schema._zod.def.shape).map(([key, valueType]) => (
                    <Stack gap={0} key={key} className="mzf-child" /* style={{
                    borderLeft: "4px solid var(--mantine-color-gray-7)",
                    paddingLeft: "8px",
                }} */>
                        {/* <Text fz="xs" c="red" inline span>
                            {key} ({valueType._zod.def.type})
                        </Text> */}
                        <RecursiveEditor
                            schema={valueType}
                            path={`${path}.${key}`}
                        />
                    </Stack>
                ))}
            </Stack>
        </Stack>
    )
};

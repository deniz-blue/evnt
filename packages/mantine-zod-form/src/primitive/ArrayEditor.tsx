import type { $ZodArray, $ZodTypes } from "zod/v4/core";
import type { EditorComponent } from "../types";
import { Box, Button, CloseButton, Group, Paper, Stack } from "@mantine/core";
import { RecursiveEditor } from "../RecursiveEditor";
import { createDefaultValue } from "../default";

export const ArrayEditor: EditorComponent<$ZodArray> = ({
    schema,
    value,
    onChange,
}) => {
    const elementSchema = schema._zod.def.element;

    return (
        <Stack gap={4}>
            {value.map((v, i) => (
                <Paper key={i} withBorder p={4}>
                    <Group align="start" gap={4}
                        style={{
                            borderLeft: "4px solid var(--mantine-color-gray-7)",
                            paddingLeft: "8px",
                        }}
                    >
                        <Box flex="1">
                            <RecursiveEditor
                                key={i}
                                value={v}
                                onChange={(newV) => {
                                    const newArray = [...value];
                                    newArray[i] = newV;
                                    onChange(newArray);
                                }}
                                schema={elementSchema}
                            />
                        </Box>
                        <CloseButton
                            onClick={() => {
                                const newArray = value.filter((_, index) => index !== i);
                                onChange(newArray);
                            }}
                        />
                    </Group>
                </Paper>
            ))}

            <Group justify="end">
                <Button
                    variant="light"
                    size="compact-sm"
                    onClick={() => {
                        onChange([
                            ...value,
                            createDefaultValue(elementSchema as $ZodTypes),
                        ])
                    }}
                >
                    Add
                </Button>
            </Group>
        </Stack>
    )
};

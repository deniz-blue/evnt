import type { $ZodOptional, $ZodTypes } from "zod/v4/core";
import type { EditorComponent } from "../types";
import { Box, Button, CloseButton, Flex, Group, Paper, TextInput } from "@mantine/core";
import { RecursiveEditor } from "../RecursiveEditor";
import { createDefaultValue } from "../default";

export const OptionalEditor: EditorComponent<$ZodOptional> = ({
    schema,
    value,
    onChange,
}) => {
    const innerSchema = schema._zod.def.innerType;

    if (value === undefined) {
        return (
            <Group>
                <Button
                    variant="light"
                    size="compact-sm"
                    onClick={() => onChange(createDefaultValue(innerSchema as $ZodTypes))}
                >
                    Set
                </Button>
            </Group>
        );
    } else {
        return (
            <Paper withBorder p={4}>
                <Group gap={4} align="start">
                    <Box flex="1">
                        <RecursiveEditor
                            value={value}
                            onChange={onChange}
                            schema={innerSchema}
                        />
                    </Box>
                    <CloseButton onClick={() => onChange(undefined)} />
                </Group>
            </Paper>
        )
    }
};

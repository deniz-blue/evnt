import type { $ZodOptional, $ZodTypes } from "zod/v4/core";
import { FormContext, type EditorComponent } from "../types";
import { Box, Button, CloseButton, Flex, Group, Paper, Stack, Text, TextInput } from "@mantine/core";
import { RecursiveEditor } from "../RecursiveEditor";
import { createDefaultValue } from "../default";
import { useContext } from "react";
import { IconQuestionMark } from "@tabler/icons-react";

export const OptionalEditor: EditorComponent<$ZodOptional> = ({
    schema,
    path,
}) => {
    const form = useContext(FormContext);
    const value = form.getInputProps(path as any).value as unknown;
    const onChange = (val: any) => {
        form.setFieldValue(path as any, val);
    };
    const innerSchema = schema._zod.def.innerType;

    return (
        <Group gap={4} align="start">
            <Stack gap={4} justify="start" align="center">
                <IconQuestionMark />
                {value !== undefined && (
                    <CloseButton onClick={() => onChange(undefined)} />
                )}
            </Stack>
            {value === undefined ? (
                <Group gap={4}>
                    <Text inline span>
                        {path.split('.').slice(-1)[0]}
                    </Text>
                    <Button
                        variant="light"
                        size="compact-sm"
                        onClick={() => onChange(createDefaultValue(innerSchema as $ZodTypes))}
                    >
                        Set
                    </Button>
                </Group>
            ) : (
                <Paper flex="1">
                    <RecursiveEditor
                        schema={innerSchema}
                        path={`${path}`}
                    />
                </Paper>
            )}
        </Group>
    );
};

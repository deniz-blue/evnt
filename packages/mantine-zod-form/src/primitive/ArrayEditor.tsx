import type { $ZodArray, $ZodTypes } from "zod/v4/core";
import { FormContext, type EditorComponent } from "../types";
import { Accordion, ActionIcon, Avatar, Box, Button, Center, CloseButton, Group, Paper, Stack, Text } from "@mantine/core";
import { RecursiveEditor } from "../RecursiveEditor";
import { createDefaultValue } from "../default";
import { useContext } from "react";
import { IconBrackets } from "@tabler/icons-react";

export const ArrayEditor: EditorComponent<$ZodArray> = ({
    schema,
    path,
}) => {
    const form = useContext(FormContext);
    const value: any[] = form.getInputProps(path).value;
    const elementSchema = schema._zod.def.element;

    return (
        <Stack gap={0}>
            <Group gap={4}>
                <IconBrackets />
                <Text inline span>{path.split('.').slice(-1)[0]}</Text>
            </Group>
            <Stack className="mzf-parent" gap={0}>
                <Accordion variant="unstyled">
                    {value?.map((v, i) => (
                        <Accordion.Item key={i} value={String(i)} className="mzf-child">
                            <Center>
                                <Accordion.Control
                                    p={0}
                                    styles={{ label: { padding: 0 } }}
                                >
                                    Item {i}
                                </Accordion.Control>
                                <ActionIcon variant="subtle">
                                    <CloseButton onClick={(e) => {
                                        e.stopPropagation();
                                        const newArray = value.filter((_, index) => index !== i);
                                        form.setFieldValue(path, newArray);
                                    }} />
                                </ActionIcon>
                            </Center>
                            <Accordion.Panel>
                                <Box>
                                    <RecursiveEditor
                                        key={i}
                                        path={`${path}.${i}`}
                                        schema={elementSchema}
                                    />
                                    <Group justify="end" mt={8}>
                                        <Button
                                            variant="light"
                                            size="compact-sm"
                                            onClick={() => {
                                                const newArray = value.filter((_, index) => index !== i);
                                                form.setFieldValue(path, newArray);
                                            }}>
                                            Remove
                                        </Button>
                                    </Group>
                                </Box>
                            </Accordion.Panel>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </Stack>
            <Group justify="start" pl={24}>
                <Button
                    variant="light"
                    size="compact-sm"
                    onClick={() => {
                        form.setFieldValue(path, [
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

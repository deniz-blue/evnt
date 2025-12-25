import { Group, Input, Stack } from "@mantine/core";
import { TranslationsSchema } from "../../../schema/src/types/Translations";
import { EditorComponent } from "../types";
import z from "zod";
import { IconWorld } from "@tabler/icons-react";

export const TranslationsEditor: EditorComponent<typeof TranslationsSchema> = ({
    schema,
    path,
}) => {
    return (
        <Stack gap={0}>
            <Group wrap="nowrap" gap={4}>
                <IconWorld />
                <Input.Label>{path.split(".").pop() || ""}</Input.Label>
            </Group>
            <Input.Description>{z.globalRegistry.get(schema)?.description}</Input.Description>
        </Stack>
    );
}

import type { $ZodDiscriminatedUnion, $ZodLiteralDef, $ZodObject, $ZodObjectDef, $ZodOptional, $ZodTypes, $ZodUnion } from "zod/v4/core";
import { FormContext, type EditorComponent } from "../types";
import { Box, Button, CloseButton, Flex, Group, Input, Select, Stack, Text, TextInput } from "@mantine/core";
import { RecursiveEditor } from "../RecursiveEditor";
import { createDefaultValue } from "../default";
import { useContext } from "react";

export const UnionEditor: EditorComponent<$ZodUnion> = ({
    schema,
    path,
}) => {
    const form = useContext(FormContext);

    return (
        <Stack gap={0}>
            <Input.Label>{path.split('.').slice(-1)[0]} (union)</Input.Label>
        </Stack>
    );
};

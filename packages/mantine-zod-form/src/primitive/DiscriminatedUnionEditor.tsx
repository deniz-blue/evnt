import type { $ZodDiscriminatedUnion, $ZodLiteralDef, $ZodObject, $ZodObjectDef, $ZodOptional, $ZodTypes, $ZodUnion } from "zod/v4/core";
import { FormContext, type EditorComponent } from "../types";
import { Box, Button, CloseButton, Flex, Group, Input, Select, Stack, Text, TextInput } from "@mantine/core";
import { RecursiveEditor } from "../RecursiveEditor";
import { createDefaultValue } from "../default";
import { useContext } from "react";

export const DiscriminatedUnionEditor: EditorComponent<$ZodDiscriminatedUnion> = ({
    schema,
    path,
}) => {
    const form = useContext(FormContext);
    const value = form.getInputProps(path as any).value as unknown;
    const onChange = (val: any) => {
        form.setFieldValue(path as any, val);
    };
    const discriminatorKey = schema._zod.def.discriminator;

    const schemas: Record<string, $ZodTypes> = Object.fromEntries(
        schema._zod.def.options.map(o => {
            const objDef = o._zod.def as $ZodObjectDef;
            const discSchema = objDef.shape[discriminatorKey];
            const discValue = (discSchema?._zod.def as $ZodLiteralDef<any>).values[0];
            return [discValue, o];
        })
    );

    const discriminatedValue = (value as any)[discriminatorKey];
    const activeSchema = schemas[discriminatedValue];

    if (!activeSchema) {
        return <Text c="red">Invalid discriminated union value</Text>
    }

    return (
        <Stack gap={0}>
            <Input.Label>{path.split('.').slice(-1)[0]} (discriminated union)</Input.Label>
            <Select
                label={discriminatorKey}
                data={Object.keys(schemas).map(key => ({ value: key, label: key }))}
                value={(value as any)[discriminatorKey]}
                onChange={val => {
                    console.log("Discriminator changed to:", val);
                    if (!val) return;
                    const newSchema = schemas[val];
                    if (!newSchema) return;
                    // TODO: try to preserve other fields if possible
                    const newValue = createDefaultValue(newSchema);
                    onChange(newValue);
                }}
            />

            <RecursiveEditor<any>
                schema={activeSchema}
                path={path}
            />
        </Stack>
    );
};

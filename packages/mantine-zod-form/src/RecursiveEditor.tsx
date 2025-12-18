import { Code, Group, Paper, Stack, Text, TextInput } from "@mantine/core";
import * as z from "zod/v4/core";
import type { EditorComponent, EditorComponentProps } from "./types";
import { OptionalEditor } from "./primitive/OptionalEditor";
import { StringEditor } from "./primitive/StringEditor";
import { RecordEditor } from "./primitive/RecordEditor";
import { ObjectEditor } from "./primitive/ObjectEditor";
import { ArrayEditor } from "./primitive/ArrayEditor";
import { DiscriminatedUnionEditor } from "./primitive/DiscriminatedUnionEditor";

type ComponentTy = EditorComponent;

export const RecursiveEditor = <$Def extends z.$ZodType = z.$ZodType,>({
    schema,
    value,
    onChange,
}: EditorComponentProps<$Def>) => {
    const overrides: Partial<Record<string, ComponentTy>> = {
        Translations: () => {
            return (
                <Text>TranslationsEditor</Text>
            )
        },
    };

    const components = {
        string: StringEditor,
        literal: () => {
            const x = schema._zod.def as z.$ZodLiteralDef<any>;
            return (
                <Code>
                    {x.values}
                </Code>
            );
        },
        union: DiscriminatedUnionEditor,
        object: ObjectEditor,
        record: RecordEditor,
        optional: OptionalEditor,
        array: ArrayEditor,
    } satisfies Partial<Record<z.$ZodTypeDef["type"], ComponentTy & any>>;

    const zType = schema._zod.def.type;
    const zId = z.globalRegistry.get(schema)?.id;

    // @ts-ignore
    const Component = (zId && overrides[zId]) || (components[zType]);

    return (
        <Paper>
            {Component ? (
                <Component
                    schema={schema}
                    value={value}
                    onChange={onChange}
                />
            ) : (
                <Text c="red">
                    Unimplemented: {zType}
                </Text>
            )
            }
        </Paper>
    );
}

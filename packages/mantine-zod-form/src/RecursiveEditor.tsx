import { Code, Group, Paper, Stack, Text, TextInput } from "@mantine/core";
import * as core from "zod/v4/core";
import z from "zod/v4";
import type { EditorComponent, EditorComponentProps } from "./types";
import { OptionalEditor } from "./primitive/OptionalEditor";
import { StringEditor } from "./primitive/StringEditor";
import { RecordEditor } from "./primitive/RecordEditor";
import { ObjectEditor } from "./primitive/ObjectEditor";
import { ArrayEditor } from "./primitive/ArrayEditor";
import { DiscriminatedUnionEditor } from "./primitive/DiscriminatedUnionEditor";
import { useMemo } from "react";
import { TranslationsEditor } from "./custom/TranslationsEditor";
import { UnionEditor } from "./primitive/UnionEditor";
import { IconSquare } from "@tabler/icons-react";

type ComponentTy = EditorComponent<any>;
type ZodTypeDefType = core.$ZodTypeDef["type"];

export const RecursiveEditor = <$Def extends core.$ZodType = core.$ZodType,>({
    schema,
    path,
}: EditorComponentProps<$Def>) => {
    const overrides = useMemo(() => {
        const map = new Map<string, ComponentTy>();
        map.set("Translations", TranslationsEditor);
        return map;
    }, []);

    const components: Partial<Record<ZodTypeDefType, ComponentTy>> = {
        string: StringEditor,
        literal: () => {
            const x = schema._zod.def as core.$ZodLiteralDef<any>;
            return (
                <Group gap={4}>
                    <IconSquare />
                    <Text inline span>{path.split('.').slice(-1)[0]}</Text>
                    <Text inline span>=</Text>
                    <Code>
                        {x.values}
                    </Code>
                </Group>
            );
        },
        union: ({ schema, path }) => {
            if (schema instanceof core.$ZodDiscriminatedUnion) {
                return <DiscriminatedUnionEditor schema={schema as core.$ZodDiscriminatedUnion} path={path} />
            } else {
                return <UnionEditor schema={schema as core.$ZodUnion} path={path} />;
            }
        },
        object: ObjectEditor,
        record: RecordEditor,
        optional: OptionalEditor,
        array: ArrayEditor,
    };

    const zType = schema._zod.def.type as ZodTypeDefType;
    const jsonSchema = z.toJSONSchema(schema);
    const zJsonRef = jsonSchema.$ref?.slice("#/$defs/".length);
    const Component: ComponentTy | undefined = (zJsonRef && overrides.get(zJsonRef)) || (components[zType] as ComponentTy | undefined);

    return (
        <Paper>
            {Component != undefined ? (
                <Component
                    schema={schema}
                    path={path.startsWith(".") ? path.slice(1) : path}
                />
            ) : (
                <Text fz="xs" c="red" inline span>
                    Unimplemented: {zType}
                </Text>
            )
            }
        </Paper>
    );
}

import type { $ZodString } from "zod/v4/core";
import { FormContext, type EditorComponent } from "../types";
import { Group, TextInput } from "@mantine/core";
import z from "zod";
import { useContext } from "react";
import { IconQuote } from "@tabler/icons-react";

export const StringEditor: EditorComponent<$ZodString> = ({
    schema,
    path,
}) => {
    const form = useContext(FormContext);
    const props = form.getInputProps(path);

    return (
        <TextInput
            label={(
                <Group gap={4} wrap="nowrap">
                    <IconQuote />
                    {path.split('.').slice(-1)[0]}
                </Group>
            )}
            description={z.globalRegistry.get(schema)?.description}
            {...props}
            // value={""+value}
            // onChange={(v) => onChange(v.currentTarget.value)}
        />
    )
};

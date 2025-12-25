import type { $ZodString } from "zod/v4/core";
import { FormContext, type EditorComponent } from "../types";
import { TextInput } from "@mantine/core";
import z from "zod";
import { useContext } from "react";

export const StringEditor: EditorComponent<$ZodString> = ({
    schema,
    path,
}) => {
    const form = useContext(FormContext);
    const props = form.getInputProps(path);

    return (
        <TextInput
            label={path.split('.').slice(-1)[0]}
            description={z.globalRegistry.get(schema)?.description}
            {...props}
        />
    )
};

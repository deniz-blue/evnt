import { useForm } from "@mantine/form";
import { FormContext } from "./types";
import { RecursiveEditor } from "./RecursiveEditor";
import { zod4Resolver } from "mantine-form-zod-resolver";
import * as z from "zod/v4/core";

export const ZodFormEditor = <TSchema extends z.$ZodType = z.$ZodType,>({
    schema,
    onChange,
    value,
}: {
    schema: TSchema;
    value?: z.infer<TSchema>;
    onChange?: (value: z.infer<TSchema>) => void;
}) => {
    const form = useForm({
        mode: "controlled",
        initialValues: value || {},
        validate: zod4Resolver(schema),
        validateInputOnChange: true,
        onValuesChange: (values, prev) => {
            onChange?.(values as z.infer<TSchema>);
        },
    });

    return (
        <FormContext value={form}>
            <RecursiveEditor
                schema={schema}
                path=""
            />
        </FormContext>
    );
};

import { Button, JsonInput, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { randomId } from "@mantine/hooks";
import { useState } from "react";
import { prettifyError, type z } from "zod";

export interface ImportJSONModalProps<T extends z.ZodType> {
    schema: T;
    onSubmit: (data: z.infer<T>) => void;
};

export const openImportJSONModal = <T extends z.ZodType>(props: ImportJSONModalProps<T>) => {
    const modalId = randomId();
    modals.open({
        title: "Add Event JSON",
        size: "xl",
        modalId,
        children: (
            <ImportJSONModal
                schema={props.schema}
                onSubmit={(data) => {
                    props.onSubmit(data);
                    modals.close(modalId);
                }}
            />
        ),
    });
}

export const ImportJSONModal = <T extends z.ZodType>({
    schema,
    onSubmit,
}: ImportJSONModalProps<T>) => {
    const [json, setJson] = useState("");

    let error = "";
    let parsed = null;
    let result: z.ZodSafeParseResult<z.infer<T>> | null = null;
    try {
        parsed = JSON.parse(json);
        result = schema.safeParse(parsed);
        if (!result.success) {
            error = prettifyError(result.error);
        }
    } catch (e) {
        error = "Invalid JSON";
    }

    return (
        <Stack>
            <JsonInput
                value={json}
                onChange={setJson}
                minRows={5}
                autosize
                placeholder="Paste event JSON here..."
                error={error}
                styles={{
                    error: { whiteSpace: "pre-wrap" },
                }}
            />
            <Button
                disabled={!!error || !json || !result || !result.success}
                onClick={() => {
                    if (result && result.success)
                        onSubmit(result.data);
                }}
            >
                Import
            </Button>
        </Stack>
    );
}

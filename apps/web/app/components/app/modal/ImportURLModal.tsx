import { Button, JsonInput, Stack, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { randomId } from "@mantine/hooks";
import { useState } from "react";
import { prettifyError, type z } from "zod";
import { fetchValidate } from "../../../lib/util/fetchValidate";

export interface ImportURLModalProps<T> {
    schema: z.ZodType<T>;
    onSubmit: (url: string, data: T) => void;
};

export const openImportURLModal = <T extends z.ZodType>(props: ImportURLModalProps<T>) => {
    const modalId = randomId();
    modals.open({
        title: "Import Event from URL",
        size: "lg",
        modalId,
        children: (
            <ImportURLModal
                schema={props.schema}
                onSubmit={(url, data) => {
                    props.onSubmit(url, data);
                    modals.close(modalId);
                }}
            />
        ),
    });
}

export const ImportURLModal = <T,>({
    schema,
    onSubmit,
}: ImportURLModalProps<T>) => {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    return (
        <Stack>
            <TextInput
                value={url}
                onChange={e => setUrl(e.currentTarget.value)}
                placeholder="URL to event JSON..."
                error={error}
                styles={{
                    error: { whiteSpace: "pre-wrap" },
                }}
            />
            <Button
                disabled={!url}
                loading={loading}
                onClick={async () => {
                    setLoading(true);
                    setError(null);
                    const result = await fetchValidate(url, schema);
                    if (!result.ok) {
                        setError(result.error);
                        setLoading(false);
                        return;
                    }

                    onSubmit(url, result.value);
                    setLoading(false);
                }}
            >
                Import
            </Button>
        </Stack>
    );
}

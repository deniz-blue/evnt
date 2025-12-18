import type { ComponentType } from "react";
import type { $ZodType } from "zod/v4/core";

export type EditorComponent<$T extends $ZodType = $ZodType> = ComponentType<EditorComponentProps<$T>>;

export interface EditorComponentProps<$T extends $ZodType = $ZodType> {
    schema: $T;
    value: $T["_zod"]["output"];
    onChange: (value: $T["_zod"]["output"]) => void;
}

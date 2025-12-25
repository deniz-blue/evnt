import { createContext, type ComponentType } from "react";
import type { $ZodType } from "zod/v4/core";
import type { UseFormReturnType } from "@mantine/form";

/* export type EditorComponent<$T extends $ZodType = $ZodType> = ComponentType<EditorComponentProps<$T>>;

export interface EditorComponentProps<$T extends $ZodType = $ZodType> {
    schema: $T;
    value: $T["_zod "]["output"];
    onChange: (value: $T["_zod"]["output"]) => void;
} */

export const FormContext = createContext<UseFormReturnType<any>>(null as any);

export type EditorComponent<$T extends $ZodType = $ZodType> = React.FC<EditorComponentProps<$T>>;

export interface EditorComponentProps<$T extends $ZodType = $ZodType> {
    schema: $T;
    path: string;
}

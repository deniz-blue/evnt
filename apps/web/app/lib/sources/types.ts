import type { AppEvent, Source } from "../../models/AppEvent";

export interface SourceProvider<Type extends Source["type"]> {
    id: Type;
    listEvents?: () => Promise<Extract<Source, { type: Type }>[]>;
    getEvent: (source: Extract<Source, { type: Type }>) => Promise<AppEvent | null>;
};

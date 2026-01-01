import type { EventData } from "../schemas/EventData";
import type { Translations } from "../types/Translations";

export interface StringifyOptions {
    locale?: string;
    timezone?: string;
    hour12?: boolean;
}

export const stringifyEventData = (event: EventData, options?: StringifyOptions) => {
    const t = (x?: Translations) => x?.[options?.locale || "en"] || x?.["en"] || "";

    const lines: string[] = [];

    lines.push(`${t(event.name)}`);
    if (event.description) {
        lines.push(`${t(event.description)}`);
    }

    

    return lines.join("\n");
};

import type { Translations } from "@repo/model";
import { useCallback } from "react";
import { useInteraction } from "discord-jsx-renderer";

export const useTranslations = () => {
    const interaction = useInteraction();
    const locale = (interaction?.locale ?? "en").split("-")[0] ?? "en";

    const tr = useCallback((value?: Translations) => {
        return value?.[locale] ?? value?.["en"] ?? "";
    }, [locale]);
    
    return tr;
}

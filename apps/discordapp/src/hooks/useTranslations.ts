import type { Translations } from "@repo/model";
import { useCallback } from "react";
import {} from "discord-jsx-renderer";

export const useTranslations = () => {
    // TODO: upstream: impl useInteraction hook
    const locale = "en";

    const tr = useCallback((value?: Translations) => {
        return value?.[locale] ?? value?.["en"] ?? "";
    }, [locale]);
    
    return tr;
}

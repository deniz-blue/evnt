import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { LOCALSTORAGE_LOCALE_KEY } from "../constants";
import { useCallback } from "react";
import type { Translations } from "@evnt/schema";

export interface LocaleStore {
    language: string;
    setLanguage: (lang: string) => void;
    timezone?: string;
};

export const useLocaleStore = create<LocaleStore>()(
    persist(
        immer((set, get) => ({
            language: "en",
            setLanguage: (lang: string) => set((state) => {
                state.language = lang;
            }),
        })),
        {
            name: LOCALSTORAGE_LOCALE_KEY,
            version: 1,
        },
    ),
);

export const useTranslations = () => {
    const language = useLocaleStore((state) => state.language);

    const resolve = useCallback((input?: Translations | null): string => {
        // Logic could be improved
        if (!input) return "";
        if (input[language]) return input[language];
        if (input["en"]) return input["en"];
        const firstKey = Object.keys(input)[0];
        if (firstKey  && input[firstKey]) return input[firstKey];
        return "";
    }, [language]);

    return resolve;
};

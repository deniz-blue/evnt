import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { LOCALSTORAGE_HOME_KEY } from "../constants";

interface HomeState {
    pinnedEventIds: number[];
}

interface HomeActions {
    pinEvent: (id: number) => void;
    unpinEvent: (id: number) => void;
}

export const useHomeStore = create<HomeState & HomeActions>()(
    persist(
        immer((set) => ({
            pinnedEventIds: [],
            pinEvent: (id: number) => set((state) => {
                if (!state.pinnedEventIds.includes(id)) {
                    state.pinnedEventIds.push(id);
                }
            }),
            unpinEvent: (id: number) => set((state) => {
                state.pinnedEventIds = state.pinnedEventIds.filter(eventId => eventId !== id);
            }),
        })),
        {
            name: LOCALSTORAGE_HOME_KEY,
            version: 1,
        }
    ),
);

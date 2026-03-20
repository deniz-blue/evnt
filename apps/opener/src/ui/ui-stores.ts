import { create } from "zustand";
import type { Intent } from "../../lib/intent";

export const useIntent = create<Intent | null>()(() => null);
export const useUIMessage = create<string | null>()(() => null);

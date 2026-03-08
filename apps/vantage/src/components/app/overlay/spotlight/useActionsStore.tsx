import { create } from "zustand";

export interface Action {
	label?: string;
	icon?: React.ReactNode;
	category?: string;
	execute?: () => void;
};

export interface ActionsStore {
	actions: Record<string, Action>;
};

export const useActionsStore = create<ActionsStore>(() => ({
	actions: {},
}));

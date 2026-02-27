import { create } from "zustand";

export interface Action {
	label?: string;
	onClick?: () => void;
	icon?: React.ReactNode;
};

export interface ActionsStore {
	actions: Record<string, Action>;
};

export const useActionsStore = create<ActionsStore>(() => ({
	actions: {},
}));

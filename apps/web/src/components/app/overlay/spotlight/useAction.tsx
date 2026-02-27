import { useId } from "@mantine/hooks";
import { useActionsStore, type Action } from "./useActionsStore";
import { useEffect } from "react";

export const useProvideAction = (
	action: Action & {
		id?: string;
		disabled?: boolean;
		deps?: React.DependencyList;
	},
) => {
	const generatedId = useId();
	const actionId = action.id ?? generatedId;

	useEffect(() => {
		if (!action.disabled) useActionsStore.setState(state => ({
			actions: {
				...state.actions,
				[actionId]: action,
			},
		}));

		return () => {
			useActionsStore.setState(state => {
				const newActions = { ...state.actions };
				delete newActions[actionId];
				return { actions: newActions };
			});
		};
	}, action.deps ?? []);

	return null;
};

export const useResolvedAction = (id: string) => {
	return useActionsStore(state => state.actions[id]) ?? null;
};


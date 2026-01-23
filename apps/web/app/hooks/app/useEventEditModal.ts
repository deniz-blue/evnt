import { useQueryModalState } from "../base/useQueryModalState";

export const useEventEditModal = () => useQueryModalState("eventEdit", true);

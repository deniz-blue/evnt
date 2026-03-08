import { useSearchParamKey } from "../base/useSearchParamKey";

export const useSettingsOverlay = () => useSearchParamKey("settings");
export const useEventDetailsModal = () => useSearchParamKey("event");
export const useViewIndexModal = () => useSearchParamKey("view-index");

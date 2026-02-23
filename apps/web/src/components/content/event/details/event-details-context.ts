import { createContext, useContext } from "react";
import type { EventDetailsContentProps } from "./EventDetailsContent";

export const EventDetailsContext = createContext<EventDetailsContentProps>({
	data: null,
});

export const useEventDetailsContext = () => useContext(EventDetailsContext);

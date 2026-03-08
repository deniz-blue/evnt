import { createContext, useContext } from "react";
import type { EventCardProps } from "./EventCard";

export const EventCardContext = createContext<EventCardProps>({});
export const useEventCardContext = () => useContext(EventCardContext);

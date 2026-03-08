import { createContext, useContext, type PropsWithChildren } from "react";
import type { EventEnvelope } from "../../../db/models/event-envelope";

export interface EventEnvelopeContext extends Omit<EventEnvelope, "draft"> {
	isDraft?: boolean;
};

const EventEnvelopeContext = createContext<EventEnvelopeContext>({
	data: null,
});

export const useEventEnvelope = () => useContext(EventEnvelopeContext);

export const EventEnvelopeProvider = ({
	value,
	children,
}: PropsWithChildren<{ value: EventEnvelope }>) => (
	<EventEnvelopeContext.Provider value={{
		...value,
		data: value.draft ?? value.data,
		isDraft: !!value.draft,
	}}>
		{children}
	</EventEnvelopeContext.Provider>
);

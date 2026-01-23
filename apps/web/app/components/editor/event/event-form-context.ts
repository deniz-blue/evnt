import type { EventData } from "@evnt/schema";
import { createFormContext, type UseForm, type UseFormReturnType } from "@mantine/form";

export const [
	EventFormProvider,
	useEventFormContext,
	useEventForm
]: [
	React.FC<{ form: UseFormReturnType<EventData>, children: React.ReactNode }>,
	() => UseFormReturnType<EventData>,
	UseForm<EventData>
] = createFormContext<EventData>();

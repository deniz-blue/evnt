import { EventDataSchema, type EventData } from "@evnt/schema";
import { createFormContext, type UseForm, type UseFormInput, type UseFormReturnType } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";

const [
	EventFormProvider,
	useEventFormContext,
	useEventFormHook
]: [
		React.FC<{ form: UseFormReturnType<EventData>, children: React.ReactNode }>,
		() => UseFormReturnType<EventData>,
		UseForm<EventData>
	] = createFormContext<EventData>();

export { EventFormProvider, useEventFormContext };

export const useEventForm = ({
	...props
}: UseFormInput<EventData> = {}) => {
	return useEventFormHook({
		validate: zod4Resolver(EventDataSchema),
		initialValues: {
			v: 0,
			name: {},
		},
		mode: "controlled",
		cascadeUpdates: true,
		...props,
	});
};

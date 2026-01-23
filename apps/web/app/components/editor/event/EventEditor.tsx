import { EventDataSchema, type EventData } from "@evnt/schema";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { EventDetailsEditor } from "./EventDetailsEditor";
import { EventFormProvider } from "./event-form-context";

export const EventEditor = () => {
	const form = useForm<EventData>({
		initialValues: {
			v: 0,
			name: {},
			venues: [],
			instances: [],
		},
		validate: zod4Resolver(EventDataSchema),
	});

	return (
		<EventFormProvider form={form}>
			<Stack>
				<EventDetailsEditor />
			</Stack>
		</EventFormProvider>
	);
};

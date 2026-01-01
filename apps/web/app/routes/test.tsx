import type { Route } from "./+types/home";
import { Container, JsonInput } from "@mantine/core";
import { EventDataSchema, type EventData, type Translations } from "@evnt/schema";
import { ZodFormEditor } from "@denizblue/mantine-zod-form";
import { useState } from "react";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "Universal Events Format" },
	];
}

export default function Home() {
	const [state, setState] = useState({
		v: 0,
		name: {} as Translations,
		instances: [],
		venues: [],
	} satisfies EventData)

	return (
		<Container size="md" py="xl">
			<ZodFormEditor
				schema={EventDataSchema}
				value={state}
				onChange={s => setState(s as any)}
			/>

			<JsonInput
				value={JSON.stringify(state, null, 2)}
				readOnly
				autosize
			/>
		</Container>
	);
}

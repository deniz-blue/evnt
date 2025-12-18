import type { Route } from "./+types/home";
import { Container, JsonInput } from "@mantine/core";
import { EventDataSchema, type EventData } from "@repo/model";
import { RecursiveEditor } from "@denizblue/mantine-zod-form";
import { useState } from "react";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "Universal Events Format" },
	];
}

export default function Home() {
	const [state, setState] = useState({
		v: 0,
		name: {},
		instances: [],
		venues: [],
	} satisfies EventData)

	return (
		<Container size="md" py="xl">
			<RecursiveEditor
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

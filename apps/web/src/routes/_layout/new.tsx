import type { EventData } from "@evnt/schema";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { atom, useSetAtom } from "jotai";
import { useMemo } from "react";
import { EventActions } from "../../lib/actions/event-actions";
import { FormPageTemplate } from "../form";

export const Route = createFileRoute("/_layout/new")({
	component: NewPage,
})

function NewPage() {
	const dataAtom = useMemo(() => atom<EventData | null>({ v: 0, name: {} }), []);

	const navigate = useNavigate();

	const mutation = useMutation({
		mutationFn: async (data: EventData) => {
			return await EventActions.createLocalEvent(data);
		},
		onSuccess: async (source) => {
			navigate({ to: "/event", search: { source } });
		},
	});

	const create = useSetAtom(useMemo(() => atom(null, async (get, set) => {
		const data = get(dataAtom);
		if (!data) return;
		mutation.mutate(data);
	}), [dataAtom, mutation]));

	return (
		<FormPageTemplate
			title="New Event"
			desc="Will be saved locally"
			continueText="Create"
			onContinue={create}
			loading={mutation.isPending}
			data={dataAtom}
		/>
	)
}

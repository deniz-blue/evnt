import type { EventData } from "@evnt/schema";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { atom, useSetAtom } from "jotai";
import { useMemo } from "react";
import { EventActions } from "../../lib/actions/event-actions";
import { FormPageTemplate } from "../form";
import { Avatar, Button, Group, Menu, Text } from "@mantine/core";
import { IconChevronDown, IconWorldOff } from "@tabler/icons-react";
import type { EventSource } from "../../db/models/event-source";
import { getAvatarOfDid, useATProtoAuthStore } from "../../lib/atproto/useATProtoStore";
import type { AtprotoDid } from "@atcute/lexicons/syntax";
import { useAtProtoHandleQuery } from "../../lib/atproto/useAtProtoHandleQuery";

export const Route = createFileRoute("/_layout/new")({
	component: NewPage,
	staticData: {
		hasEventForm: true,
	},
})

function NewPage() {
	const dataAtom = useMemo(() => atom<EventData | null>({ v: "0.1", name: {} }), []);
	const agent = useATProtoAuthStore(store => store.agent);
	const handle = useAtProtoHandleQuery(agent?.sub as AtprotoDid);
	const navigate = useNavigate();

	type Payload = { where: EventSource.Type; data: EventData };
	const mutation = useMutation({
		mutationFn: async ({ where, data }: Payload) => {
			if (where === "local") return await EventActions.createLocalEvent(data);
			if (where === "at") return await EventActions.createATProtoEvent(data);
			return null;
		},
		onSuccess: async (source) => {
			if (!source) return;
			navigate({ to: "/event", search: { source } });
		},
	});

	const create = useSetAtom(useMemo(() => atom(null, async (get, set, where: EventSource.Type) => {
		const data = get(dataAtom);
		if (!data) return;
		mutation.mutate({ where, data });
	}), [dataAtom, mutation]));

	return (
		<FormPageTemplate
			title="New Event"
			desc="Will be saved locally"
			loading={mutation.isPending}
			data={dataAtom}
			button={(
				<Menu>
					<Group gap={0}>
						<Menu.Target>
							<Button
								color="green"
								loading={mutation.isPending}
								rightSection={<IconChevronDown size={16} />}
							>
								Create
							</Button>
						</Menu.Target>
					</Group>
					<Menu.Dropdown>
						<Menu.Label>Create...</Menu.Label>
						<Menu.Item
							onClick={() => create("local")}
							leftSection={<IconWorldOff />}
						>
							Locally
						</Menu.Item>
						<Menu.Item
							onClick={() => create("at")}
							disabled={!agent}
							leftSection={(
								<Avatar
									src={agent ? getAvatarOfDid(agent?.sub) : null}
									size={24}
								/>
							)}
						>
							<Text inherit ff="monospace">
								{handle.data ? `@${handle.data}` : (agent?.sub ? agent.sub : "AT Protocol")}
							</Text>
						</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			)}
		/>
	)
}

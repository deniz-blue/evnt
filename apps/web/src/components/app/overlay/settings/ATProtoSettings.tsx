import { ActionIcon, Avatar, Button, Code, Group, Input, Loader, Menu, Paper, Stack, Text, TextInput, Tooltip } from "@mantine/core";
import { getAvatarOfDid, useATProtoAuthStore } from "../../../../lib/atproto/useATProtoStore";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { IconArrowRight, IconCheck, IconDots, IconExternalLink, IconPlus, IconX } from "@tabler/icons-react";
import { ExternalLink } from "../../../content/base/ExternalLink";
import { useAtProtoHandleQuery } from "../../../../lib/atproto/useAtProtoHandleQuery";
import type { Did } from "@atcute/lexicons";

export const ATProtoSettings = () => {
	const session = useATProtoAuthStore(store => store.session);

	return (
		<Stack>
			<ATProtoAccountsList />
			<ATProtoAddAccount />
		</Stack>
	);
}

export const ATProtoAccountsList = () => {
	const sessions = useATProtoAuthStore(store => store.sessions);

	return (
		<Stack w="100%" gap={4}>
			{sessions?.map(did => (
				<ATProtoAccountItem key={did} did={did} />
			))}
		</Stack>
	);
};

export const ATProtoAccountItem = ({ did }: { did: Did }) => {
	const agent = useATProtoAuthStore(store => store.agent);
	const signIn = useATProtoAuthStore(store => store.signIn);
	const signOut = useATProtoAuthStore(store => store.signOut);
	const handle = useAtProtoHandleQuery(did as Did<"plc" | "web">);
	const isCurrent = agent?.sub === did;

	return (
		<Paper w="100%">
			<Group gap={4} wrap="nowrap" align="center">
				<ActionIcon
					size="input-xs"
					color="gray"
					variant="subtle"
				>
					<Avatar
						src={getAvatarOfDid(did)}
						size="sm"
					/>
				</ActionIcon>
				<Button
					variant="subtle"
					color="gray"
					size="xs"
					flex="1"
					justify="space-between"
					styles={{ root: { padding: 4 }, label: { overflow: "visible" } }}
					rightSection={isCurrent && (
						<IconCheck size={16} color="green" style={{ marginInlineEnd: 0 }} />
					)}
					onClick={() => signIn(did)}
				>
					<Text span inline c={isCurrent ? "unset" : "dimmed"}>
						{handle.data?.slice(5) ?? did}
					</Text>
				</Button>
				<Menu>
					<Menu.Target>
						<ActionIcon
							size="input-xs"
							color="gray"
							variant="subtle"
						>
							<IconDots size={16} />
						</ActionIcon>
					</Menu.Target>
					<Menu.Dropdown>
						<Menu.Item
							component="a"
							href={`https://pds.ls/at://${did}`}
							target="_blank"
							leftSection={<IconExternalLink size={16} />}
						>
							View on pds.ls
						</Menu.Item>
						<Menu.Item
							component="a"
							href={`https://bsky.app/profile/${did}`}
							target="_blank"
							leftSection={<IconExternalLink size={16} />}
						>
							View on bsky.app
						</Menu.Item>
						<Menu.Item
							color="red"
							onClick={() => signOut(did)}
							leftSection={<IconX size={16} />}
						>
							Sign Out
						</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			</Group>
		</Paper>
	);
}

export const ATProtoAddAccount = () => {
	const [opened, { open, close }] = useDisclosure(false);
	const [identifier, setIdentifier] = useState("");
	const [loading, setLoading] = useState(false);

	const onSubmit = async () => {
		setLoading(true);
		await useATProtoAuthStore.getState().startAuthorization(identifier);
		// unreachable code after redirect
	};

	return (
		<Stack gap={4}>
			<Stack gap={0}>
				<Input.Label>
					{opened ? "Identifier" : "Add Account"}
				</Input.Label>
				<Input.Description>
					{opened ? "Your ATProto handle or email" : "Sign in with ATProto"}
				</Input.Description>
			</Stack>
			{opened ? (
				<Stack gap={4}>
					<TextInput
						placeholder="example.bsky.social"
						value={identifier}
						onChange={e => setIdentifier(e.currentTarget.value)}
						onSubmit={onSubmit}
						onKeyDown={e => {
							if (e.key == "Enter") onSubmit();
						}}
						autoFocus
						rightSection={(
							<ActionIcon
								disabled={!identifier}
								loading={loading}
								onClick={onSubmit}
							>
								<IconArrowRight />
							</ActionIcon>
						)}
						onBlur={close}
					/>
					{loading && (
						<Input.Description>Redirecting...</Input.Description>
					)}
				</Stack>
			) : (
				<Button
					leftSection={<IconPlus size={16} />}
					onClick={open}
					color="gray"
				>
					Add Account
				</Button>
			)}
		</Stack>
	);
};

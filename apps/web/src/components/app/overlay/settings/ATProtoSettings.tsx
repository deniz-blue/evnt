import { ActionIcon, Avatar, Button, Code, Group, Input, Loader, Stack, Text, TextInput, Tooltip } from "@mantine/core";
import { getAvatarOfDid, useATProtoAuthStore } from "../../../../lib/atproto/useATProtoStore";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { IconArrowRight, IconCheck, IconExternalLink, IconX } from "@tabler/icons-react";
import { ExternalLink } from "../../../content/base/ExternalLink";
import { useAtProtoHandleQuery } from "../../../../lib/atproto/useAtProtoHandleQuery";
import type { Did } from "@atcute/lexicons";

export const ATProtoSettings = () => {
	const session = useATProtoAuthStore(store => store.session);

	return (
		<Stack>
			{session ? (
				<ATProtoSignedIn />
			) : (
				<ATProtoSignedOut />
			)}
		</Stack>
	);
}

export const ATProtoSignedOut = () => {
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
					{opened ? "Identifier" : "You are not signed in"}
				</Input.Label>
				<Input.Description>
					{opened ? "Your ATProto handle or email" : "To use ATProto features, please sign in with your ATProto account."}
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
				<Button onClick={open}>Sign In with ATProto</Button>
			)}
		</Stack>
	);
};

export const ATProtoSignedIn = () => {
	const agent = useATProtoAuthStore(store => store.agent)!;
	const handle = useAtProtoHandleQuery(agent.sub as Did<"plc" | "web">);

	return (
		<Stack>
			<Group gap={4} align="start">
				<Avatar
					mt={24}
					src={getAvatarOfDid(agent.sub)}
				/>
				<Stack gap={4}>
					<Text c="dimmed" fz="xs" fw="bold">Signed in as</Text>
					<Group align="center" gap={4}>
						{handle.isLoading ? (
							<>
								<Loader size="xs" />
								<Text fz="xs">Fetching handle...</Text>
							</>
						) : handle.error ? (
							<Text fz="xs" c="red">Error fetching handle</Text>
						) : (
							<ExternalLink
								href={`https://bsky.app/profile/${handle.data}`}
								children={`${handle.data}`}
							/>
						)}
					</Group>
					<Code fz="xs">{agent.sub}</Code>
				</Stack>
			</Group>
			<Button
				component="a"
				href={`https://pds.ls/at://${agent.sub}`}
				target="_blank"
				rightSection={<IconExternalLink size={16} />}
			>
				View on PDSls
			</Button>
			<ATProtoSignOut />
		</Stack>
	);
}

export const ATProtoSignOut = () => {
	const [confirmationOpened, { open: openConfirmation, close: closeConfirmation }] = useDisclosure(false);
	const [loading, setLoading] = useState(false);
	const signOut = useATProtoAuthStore(store => store.signOut);

	return (
		<Stack>
			{confirmationOpened ? (
				<Group
					justify="space-between"
					wrap="nowrap"
				>
					<Text inline span fw="bold">Are you sure you want to sign out?</Text>
					<Group gap={4}>
						<Tooltip label="No, keep me signed in">
							<ActionIcon
								loading={loading}
								onClick={closeConfirmation}
								size="input-sm"
								color="red"
							>
								<IconX />
							</ActionIcon>
						</Tooltip>
						<Tooltip label="Yes, sign me out">
							<ActionIcon
								color="green"
								size="input-sm"
								loading={loading}
								onClick={async () => {
									setLoading(true);
									await signOut();
									setLoading(false);
								}}
							>
								<IconCheck />
							</ActionIcon>
						</Tooltip>
					</Group>
				</Group>
			) : (
				<Button variant="outline" color="red" onClick={openConfirmation}>Sign Out</Button>
			)}
		</Stack>
	);
};

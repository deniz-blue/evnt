import { ActionIcon, Avatar, Button, Code, Group, Input, Loader, Stack, Text, TextInput, Tooltip } from "@mantine/core";
import { getAvatarOfDid, useATProtoAuthStore } from "../../../../stores/useATProtoStore";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { IconArrowRight, IconCheck, IconExternalLink, IconX } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "../../../content/base/ExternalLink";

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
	const [opened, { open }] = useDisclosure(false);
	const [identifier, setIdentifier] = useState("");
	const [loading, setLoading] = useState(false);

	const onSubmit = async () => {
		setLoading(true);
		await useATProtoAuthStore.getState().signIn(identifier);
		// unreachable code after redirect
		setLoading(false);
	};

	return (
		<Stack gap={4}>
			{opened ? (
				<Stack gap={4}>
					<TextInput
						label="Identifier"
						description="Your ATProto handle or email"
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
	const agent = useATProtoAuthStore(store => store.agent);
	const rpc = useATProtoAuthStore(store => store.rpc);

	const profile = useQuery({
		queryKey: ['atproto', 'username', agent?.sub],
		queryFn: async () => {
			if (!rpc || !agent) return null;
			const res = await rpc.get("com.atproto.repo.describeRepo", {
				params: {
					repo: agent.sub,
				},
			});
			if (!res.ok) throw new Error(res.data.message || res.data.error || "Failed to fetch profile");
			return res.data.handle;
		},
	});

	if (!agent) return null;
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
						{profile.isLoading ? (
							<>
								<Loader size="xs" />
								<Text fz="xs">Fetching handle...</Text>
							</>
						) : profile.error ? (
							<Text fz="xs" c="red">Error fetching handle</Text>
						) : (
							<ExternalLink
								href={`https://bsky.app/profile/${profile.data}`}
								children={`@${profile.data}`}
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

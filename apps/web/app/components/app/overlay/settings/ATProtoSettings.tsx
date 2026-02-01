import { ActionIcon, Avatar, Button, Code, Group, Loader, Stack, Text, TextInput } from "@mantine/core";
import { getAvatarOfDid, useATProtoAuthStore } from "../../../../stores/useATProtoStore";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { IconArrowRight } from "@tabler/icons-react";
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
		<Stack>
			{opened ? (
				<Stack>
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
	const signOut = useATProtoAuthStore(store => store.signOut);

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
			<Button variant="outline" color="red" onClick={async () => {
				await signOut();
			}}>Sign Out (todo :c)</Button>
		</Stack>
	);
}

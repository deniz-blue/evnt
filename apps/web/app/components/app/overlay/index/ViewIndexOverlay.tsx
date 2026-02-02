import { BaseOverlay } from "../base/BaseOverlay";
import { useEventQueries } from "../../../../db/useEventDataQuery";
import { type EventDataSource } from "../../../../db/models/event-source";
import { Button, Code, Group, Loader, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { RQResult } from "../../../data/RQResult";
import { useViewIndexModal } from "../../../../hooks/app/useViewIndexModal";
import { useQuery } from "@tanstack/react-query";
import { fetchValidate } from "../../../../lib/util/fetchValidate";
import z from "zod";
import { EventCard } from "../../../content/event/EventCard";
import { EventContextMenu } from "../../../content/event/EventContextMenu";

export const ViewIndexOverlay = () => {
	const { isOpen, close, value: uri } = useViewIndexModal();

	console.log("ViewIndexOverlay URI:", uri);

	const index = useQuery({
		queryKey: ["fetch", uri ?? null],
		queryFn: async () => {
			if (!uri) return null;
			const [result, error] = await fetchValidate(uri, z.object({
				events: z.object({
					path: z.string(),
					lastModified: z.number().optional(),
				}).array(),
			}));
			if (error) throw error;
			return result;
		},
	});

	const allQueries = useEventQueries(index.data?.events.map(entry => (
		uri?.replace(/\/[^\/]*$/, "") + "/" + entry.path
	) as EventDataSource) ?? []);

	const filtered = allQueries; // No filters for now

	return (
		<BaseOverlay
			opened={isOpen}
			onClose={close}
		>
			<Stack>
				<Stack gap={0}>
					<Group gap={4} align="center">
						{index.isLoading && <Loader size="sm" />}
						<Title>
							{index.isLoading ? "Fetching events..." : `Index`}
						</Title>
					</Group>
					<Group>
						<Code fz="xs">
							{uri}
						</Code>
					</Group>
				</Stack>

				{index.data && (
					<Text>
						Found {index.data.events.length} events in index.
					</Text>
				)}

				{index.isError && (
					<Button
						fullWidth
						onClick={() => index.refetch()}
					>
						Retry
					</Button>
				)}

				{index.error && (
					<Text c="red">
						Error fetching index: {(index.error as Error).message}
					</Text>
				)}

				<SimpleGrid
					type="container"
					cols={{ base: 1, "680px": 2, "1400px": 3, "1800px": 4 }}
				>
					{filtered.map(({ query, source }, index) => (
						<RQResult
							key={index}
							query={query}
						>
							{(data) => (
								<EventCard
									key={index}
									value={data}
									variant="card"
									source={source}
									menu={<EventContextMenu source={source} />}
								/>
							)}
						</RQResult>
					))}
				</SimpleGrid>
			</Stack>
		</BaseOverlay>
	)
};

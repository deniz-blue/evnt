import { BaseOverlay } from "../base/BaseOverlay";
import { useEventQueries } from "../../../../db/useEventQuery";
import { type EventSource } from "../../../../db/models/event-source";
import { Button, Code, Group, Loader, Pagination, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { useViewIndexModal } from "../../../../hooks/app/useViewIndexModal";
import { useQuery } from "@tanstack/react-query";
import { fetchValidate } from "../../../../lib/util/fetchValidate";
import z from "zod";
import { EventsGrid } from "../../../content/event-grid/EventsGrid";
import { useState } from "react";

export const ViewIndexOverlay = () => {
	const { isOpen, close, value: uri } = useViewIndexModal();
	const [page, setPage] = useState(1);
	const pageSize = 36;

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

	const allSources = index.data?.events.map(entry => (
		uri?.replace(/\/[^\/]*$/, "") + "/" + entry.path
	) as EventSource) ?? [];

	const pageAmount = Math.ceil(allSources.length / pageSize);
	const pagedSources = allSources.slice((page - 1) * pageSize, page * pageSize);
	const allQueries = useEventQueries(pagedSources);
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

				{pageAmount > 1 && (
					<Group justify="flex-end">
						<Text>
							Showing {pageSize * (page - 1) + 1} - {Math.min(allSources.length, pageSize * page)} of {allSources.length}
						</Text>
						<Pagination
							total={pageAmount}
							value={page}
							onChange={setPage}
							withPages={false}
						/>
					</Group>
				)}

				<EventsGrid queries={filtered} />

				{pageAmount > 1 && (
					<Group justify="center">
						<Pagination
							total={pageAmount}
							value={page}
							onChange={setPage}
						/>
					</Group>
				)}
			</Stack>
		</BaseOverlay>
	)
};

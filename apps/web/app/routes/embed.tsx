import { useSearchParams } from "react-router";
import { UtilEventSource } from "../db/models/event-source";
import { Stack, Text } from "@mantine/core";
import { useEventQueries } from "../db/useEventQuery";
import { EventCard } from "../components/content/event/EventCard";

export default function EmbedPage() {
	const [searchParams] = useSearchParams();
	const sourceParam = searchParams.get("source");
	const source = sourceParam && UtilEventSource.is(sourceParam, false) ? sourceParam : null;

	const [result] = useEventQueries(source ? [source] : []);

	if (!source) return (
		<Stack align="center" justify="center" style={{ height: "100%" }}>
			<Text>Invalid source parameter!</Text>
		</Stack>
	);

	return (
		<Stack align="center" justify="center" style={{ height: "100%" }}>
			<EventCard
				data={result?.query.data?.data ?? null}
				err={result?.query.data?.err}
				rev={result?.query.data?.rev}
				loading={result?.query.isLoading ?? false}
				source={source}
				embed
			/>
			<style children="html, body { height: 100%; margin: 0; }" />
		</Stack>
	)
}

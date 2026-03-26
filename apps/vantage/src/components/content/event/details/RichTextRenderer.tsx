import { segmentize, type Facet } from "@atcute/bluesky-richtext-segmenter";
import { Anchor, Paper, Text } from "@mantine/core";
import type { ReactNode } from "react";

export const RichTextRenderer = ({
	content,
	facets,
}: {
	content: string;
	facets: Facet[];
}) => {
	const segments = segmentize(content, facets);

	return (
		<Paper>
			<Text style={{ whiteSpace: "pre-wrap" }}>
				{segments.map((segment, index) => {
					let el: ReactNode = segment.text;

					for (const feature of (segment.features ?? []) as any[]) {
						if (feature.$type === "app.bsky.richtext.facet#link")
							el = (
								<Anchor
									key={index}
									href={feature.uri}
									inherit
									target="_blank"
								>
									{el}
								</Anchor>
							)
						else if (feature.$type === "app.bsky.richtext.facet#mention")
							el = (
								<Anchor
									key={index}
									href={`https://stargraph.link/user/${feature.did}`}
									inherit
									target="_blank"
								>
									{el}
								</Anchor>
							);
					}

					return (
						<Text key={index} span inherit>
							{el}
						</Text>
					);
				})}
			</Text>
		</Paper>
	);
};

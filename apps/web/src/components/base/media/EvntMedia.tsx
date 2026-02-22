import type { Media } from "@evnt/schema";
import { Box, Image } from "@mantine/core";
import { Blurhash } from "./Blurhash";
import { OverLayer } from "../layout/OverLayer";
import { useState } from "react";
import { CenteredLoader } from "../../content/base/CenteredLoader";

export const EvntMedia = ({
	media,
	objectFit = "cover",
}: {
	media: Media;
	objectFit?: React.CSSProperties["objectFit"];
}) => {
	const [loaded, setLoaded] = useState(false);

	const srcset = media.sources.map(source => (
		source.url + (source.dimensions?.width ? ` ${source.dimensions.width}w` : "")
	)).join(", ");

	return (
		<Box w="100%" h="100%" pos="relative">
			{!!media.presentation?.blurhash && (
				<OverLayer>
					<Blurhash hash={media.presentation.blurhash} />
				</OverLayer>
			)}

			{!loaded && (
				<OverLayer opacity={0.4}>
					<CenteredLoader loaderColor="black" />
				</OverLayer>
			)}

			<OverLayer>
				<Box
					component="img"
					src={media.sources[0]?.url}
					srcSet={srcset}
					style={{ objectFit }}
					loading="lazy"
					w="100%"
					h="100%"
					onLoad={() => setLoaded(true)}
				/>
			</OverLayer>
		</Box>
	);
};

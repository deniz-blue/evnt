import type { EventComponent } from "@evnt/schema";
import classes from "./event-card.module.css";
import { useEventCardContext } from "./event-card-context";
import { OverLayer } from "../../../base/layout/OverLayer";
import { EvntMedia } from "../../../base/media/EvntMedia";
import { Blurhash } from "../../../base/media/Blurhash";
import type { ReactNode } from "react";

export interface EventCardBackgroundProps {
	backgroundDim?: number;
	backgroundOpacity?: number;
};

export const EventCardBackground = (props: EventCardBackgroundProps) => {
	const { data, variant } = useEventCardContext();

	const backgroundMedia = data?.components
		?.find((c): c is EventComponent & { type: "splashMedia" } =>
			c.type === "splashMedia" && c.data.roles.includes("background"))
		?.data?.media;

	let backgroundElement: ReactNode = null;
	if (variant !== "inline" && backgroundMedia)
		backgroundElement = <EvntMedia media={backgroundMedia} objectFit="cover" />;
	else if (variant === "inline" && backgroundMedia?.presentation?.blurhash)
		backgroundElement = <Blurhash hash={backgroundMedia.presentation.blurhash} />;

	return (
		<OverLayer style={{ opacity: props.backgroundOpacity }}>
			{backgroundElement && (
				<OverLayer>
					{backgroundElement}
				</OverLayer>
			)}
			<OverLayer
				className={classes.dim}
				style={{ "--dim": props.backgroundDim ?? (!backgroundMedia ? 0.05 : undefined) }}
			/>
		</OverLayer>
	)
};

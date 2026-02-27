import { Box, Collapse, Group, Loader, Modal, Stack, Title } from "@mantine/core";
import { useEventDetailsContext } from "./event-details-context";
import { Trans } from "../Trans";
import { EnvelopeErrorBadge } from "../envelope/EnvelopeErrorBadge";
import type { EventComponent } from "@evnt/schema";
import { OverLayer } from "../../../base/layout/OverLayer";
import classes from "../card/event-card.module.css";
import { EvntMedia } from "../../../base/media/EvntMedia";

export const EventDetailsBanner = () => {
	const { loading, data, err, withModalCloseButton } = useEventDetailsContext();

	const splashMediaComponents = data?.components
		?.filter((c): c is EventComponent & { type: "splashMedia" } =>
			c.type === "splashMedia") ?? [];

	const bannerMedia = splashMediaComponents.find(x => x.data.roles.includes("banner"))?.data?.media
		?? splashMediaComponents.find(x => x.data.roles.includes("background"))?.data?.media;

	return (
		<Stack>
			<Box
				pos="relative"
				style={{ overflow: "hidden" }}
			>
				<OverLayer>
					{bannerMedia && (
						<OverLayer>
							<EvntMedia media={bannerMedia} objectFit="cover" />
						</OverLayer>
					)}
					<OverLayer
						className={classes.dim}
						style={{ "--dim": !bannerMedia ? 0 : undefined }}
					/>
				</OverLayer>
				<Stack pos="relative" h="100%" p="xs" justify="stretch">
					<Group
						w="100%"
						h="100%"
						wrap="nowrap"
						align="stretch"
						gap={4}
					>
						<Stack
							h="100%"
							flex="1"
							mt={bannerMedia ? "4rem" : undefined}
						>
							<Group flex="1" gap={4} align="end">
								<Collapse expanded={!!loading} orientation="horizontal">
									<Loader size="sm" />
								</Collapse>
								<Title order={3}>
									<Trans t={data?.name} />
								</Title>
								<EnvelopeErrorBadge err={err} />
							</Group>
						</Stack>
						<Stack h="100%" justify="start" align="start">
							{withModalCloseButton && <Modal.CloseButton />}
						</Stack>
					</Group>
				</Stack>
			</Box>
		</Stack >
	);
};

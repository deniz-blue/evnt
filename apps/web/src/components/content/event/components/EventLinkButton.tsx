import type { LinkComponent } from "@evnt/schema";
import { UtilTranslations } from "@evnt/schema/utils";
import { Button, Group, Stack, Text } from "@mantine/core";
import { IconExternalLink, IconLink, IconLinkOff } from "@tabler/icons-react";
import { Trans } from "../Trans";

export const EventLinkButton = ({
	value,
}: {
	value: LinkComponent;
}) => {
	const disabled = false;

	let subtitle: string | null = null;
	let dateSubtitle: string | null = null;
	let hideDate = false;

	return (
		<Button
			component={disabled ? "button" : "a"}
			href={value.url}
			target="_blank"

			leftSection={disabled ? <IconLinkOff /> : <IconLink />}
			rightSection={<IconExternalLink />}

			color={disabled ? "gray.2" : undefined}
			variant="light"
			justify={"space-between"}
			ta="center"
			h="auto"
		>
			<Stack gap={0} py={subtitle ? 4 : "xs"}>
				<Text inline c={disabled ? "gray.4" : undefined}>
					<Trans t={UtilTranslations.isEmpty(value.name) ? { en: "Link" } : value.name} />
				</Text>
				<Stack
					gap={0}
					fz="xs"
					c={disabled ? "gray.6" : "blue.4"}
					style={{ textWrap: "wrap" }}
				>
					<Text inline inherit fw="normal" pt={UtilTranslations.isEmpty(value.description) ? 0 : 4}>
						<Trans t={value.description} />
					</Text>

					<Stack gap={0} pt={subtitle ? 4 : 0}>
						<Group gap={4} justify="center">
							<Text inherit inline span>
								{subtitle}
							</Text>
						</Group>

						{!hideDate && dateSubtitle && (
							<Text inherit inline fw="normal">
								({dateSubtitle})
							</Text>
						)}
					</Stack>
				</Stack>
			</Stack>
		</Button>
	);
};

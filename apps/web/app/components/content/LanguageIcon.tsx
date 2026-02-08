import type { LanguageKey } from "@evnt/schema";
import { ActionIcon, Indicator, Stack, Text, Tooltip } from "@mantine/core";
import type { ReactNode } from "react";
import { UtilLanguageCode } from "../../lib/util/language-code";

export const LanguageIcon = ({
	language,
	rightBottomSection,
	onClick,
	tooltipDisabled,
}: {
	language: LanguageKey;
	rightBottomSection?: ReactNode;
	onClick?: () => void;
	tooltipDisabled?: boolean;
}) => {
	const valid = UtilLanguageCode.isValidLanguageCode(language);

	// BCP 47 allows more subtags, but we only care about the first two for now
	const [lang, subtag] = language.split("-");

	return (
		<Tooltip label={valid ? UtilLanguageCode.getLabel(language) : "Unknown language code!"} disabled={tooltipDisabled || !valid}>
			<ActionIcon
				variant={(onClick || !valid) ? "subtle" : "transparent"}
				color={valid ? "gray" : "yellow"}
				onClick={onClick}
				component={onClick ? "button" : "div"}
			>
				<Indicator
					label={rightBottomSection}
					position="bottom-end"
					color="blue"
					offset={4}
					styles={{ indicator: { pointerEvents: "none" } }}
					disabled={!rightBottomSection}
				>
					<Stack gap={0} align="center" ta="center">
						<Text fz="xs" inherit inline span fw="bold">{lang?.toUpperCase()}</Text>
						{subtag && <Text fz="xs" inherit inline span c="dimmed">({subtag.toUpperCase()})</Text>}
					</Stack>
				</Indicator>
			</ActionIcon>
		</Tooltip>
	);
};

import type { Address } from "@evnt/schema";
import { ActionIcon, CopyButton, Text, Tooltip } from "@mantine/core";
import { CountryFlag } from "./CountryFlag";
import { IconCopy } from "@tabler/icons-react";

export const AddressSnippetLabel = ({
	value,
	withCopyButton,
}: {
	value: Address;
	withCopyButton?: boolean;
}) => {
	return (
		<Text span inline>
			{value.addr} {value.countryCode && (
				<CountryFlag countryCode={value.countryCode} />
			)} {withCopyButton && !!value.addr && (
				<CopyButton value={value.addr}>
					{({ copied, copy }) => (
						<Tooltip label={copied ? "Copied" : "Copy address"} withArrow>
							<ActionIcon
								onClick={copy}
								size="sm"
								color={copied ? "teal" : "gray"}
							>
								<IconCopy size={14} />
							</ActionIcon>
						</Tooltip>
					)}
				</CopyButton>
			)}
		</Text>
	);
};

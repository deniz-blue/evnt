import { ActionIcon, CopyButton, Tooltip } from "@mantine/core";
import { IconCheck, IconCopy, type ReactNode } from "@tabler/icons-react";

export const VantageCopyButton = ({
	value,
	labelCopied,
	labelCopy,
	icon,
}: {
	value: string;
	labelCopy?: ReactNode;
	labelCopied?: ReactNode;
	icon?: ReactNode;
}) => {
	return (
		<CopyButton value={value}>
			{({ copied, copy }) => (
				<Tooltip label={copied ? (labelCopied ?? "Copied!") : (labelCopy ?? "Copy")} withArrow>
					<ActionIcon
						size="input-md"
						onClick={copy}
						color={copied ? "teal" : "gray"}
					>
						{copied ? <IconCheck /> : (icon ?? <IconCopy />)}
					</ActionIcon>
				</Tooltip>
			)}
		</CopyButton>
	);
};

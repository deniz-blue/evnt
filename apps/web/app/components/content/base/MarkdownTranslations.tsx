import { Box, Typography } from "@mantine/core";
import { MarkdownHooks } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkEmoji from "remark-emoji";
import remarkSqueezeParagraphs from "remark-squeeze-paragraphs";
import type { Translations } from "@evnt/schema";
import { useTranslations } from "../../../stores/useLocaleStore";
import { useMemo } from "react";

export const MarkdownTranslations = ({
	content,
}: {
	content: Translations;
}) => {
	const t = useTranslations();
	const input = useMemo(() => t(content), [content, t]);

	return (
		<Box maw="100%" style={{ textWrap: "wrap", wordBreak: "break-word" }}>
			<Typography>
				<MarkdownHooks
					children={input}
					remarkPlugins={[
						[remarkGfm, { singleTilde: false }],
						[remarkBreaks],
						[remarkEmoji],
						[remarkSqueezeParagraphs],
					]}
				/>
			</Typography>
		</Box>
	);
};

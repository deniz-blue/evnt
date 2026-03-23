/// <reference types="@cloudflare/workers-types" />

import { type EventData, type KnownEventComponent, type Translations } from "@evnt/schema";
import { snippetToMarkdown } from "@evnt/pretty/markdown";
import { snippetEvent } from "@evnt/pretty";
import { fetchEventData } from "../lib/resolve-data";
import { parseIntent } from "../lib/intent";

interface Env { }

export const onRequest: PagesFunction<Env> = async (ctx) => {
	const url = new URL(ctx.request.url);
	const response = await ctx.next();

	let data: EventData | null = null;

	try {
		let intent = parseIntent(url);
		if (intent?.type == "event") data = await fetchEventData(intent);
	} catch (err) {
		console.error("Error fetching event data:", err);
	}

	const t = (translations: Translations): string =>
		translations["en"] || translations[Object.keys(translations)[0]] || "";

	let title = t(data?.name ?? {}) ?? null;

	let markdown = data ? snippetEvent(data).map(snip => snippetToMarkdown(snip)).join("\n") : "";

	let splashMediaComponents = data?.components
		?.filter((c): c is KnownEventComponent & { type: "splashMedia" } => c.type === "splashMedia")
		.map(c => c.data)
	let selected = splashMediaComponents?.find(c => c.roles.includes("ogembed"))
		?? splashMediaComponents?.find(c => c.roles.includes("embed"))
		?? splashMediaComponents?.find(c => c.roles.includes("poster"))
		?? splashMediaComponents?.[0];
	let image = selected?.media.sources[0];

	return new HTMLRewriter()
		.on('head', {
			element(element) {
				if (data) {
					element.append(`<meta property="twitter:card" content="summary"/>`, { html: true });
					element.append(`<meta property="twitter:site" content="eventsl.ink"/>`, { html: true });
					element.append(`<meta property="og:title" content="${title!}" />`, { html: true });
					if (markdown) element.append(`<meta property="og:description" content="${markdown.slice(0, 400)}" />`, { html: true });
					if (image) {
						element.append(`<meta property="og:image" content="${image.url}" />`, { html: true });
						element.append(`<meta property="twitter:image" content="${image.url}" />`, { html: true });
						if (t(selected?.media.alt ?? {}))
							element.append(`<meta property="og:image:alt" content="${t(selected?.media.alt ?? {})}" />`, { html: true });
						if (image.mimeType)
							element.append(`<meta property="og:image:type" content="${image.mimeType}" />`, { html: true });
						if (image.dimensions) {
							element.append(`<meta property="og:image:width" content="${image.dimensions.width}" />`, { html: true });
							element.append(`<meta property="og:image:height" content="${image.dimensions.height}" />`, { html: true });
						}
					}
				}
			},
		})
		.transform(response);
};

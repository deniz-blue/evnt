import type { EventComponent, KnownEventComponent, LinkComponent, SourceComponent, SplashMediaComponent, Translations } from "@evnt/schema";
import { IconExternalLink, IconLetterCase, IconLink, IconPhoto } from "@tabler/icons-react";
import type { FC } from "react";
import type { EditAtom } from "../edit-atom";
import { EditComponentLink } from "./components/EditComponentLink";
import { EditComponentSource } from "./components/EditComponentSource";
import { EditComponentSplashMedia } from "./components/EditComponentSplashMedia";
import { EditComponentBlueSkyRichText, type AppBlueSkyRichTextComponent } from "./components/EditBlueSkyRichText";

export type AppKnownComponent = KnownEventComponent | { $type: "app.bsky.richtext" } & AppBlueSkyRichTextComponent;

type EventComponentRegistryEntry = {
	label: Translations;
	desc?: Translations;
	icon: FC<{ size?: number }> | any; // Stupid typescript
	createData?: EventComponent;
	editComponent?: FC<{ data: EditAtom<any> }>;
};

export const toLegacyComponentKey = ($type: string): string => {
	if ($type === "directory.evnt.component.link") return "link";
	if ($type === "directory.evnt.component.source") return "source";
	if ($type === "directory.evnt.component.splashMedia") return "splashMedia";
	return $type;
};

export const EventComponentRegistry: Record<string, EventComponentRegistryEntry> = {
	link: {
		label: { en: "Link" },
		desc: { en: "Registration page, livestream, competition forms etc." },
		icon: IconLink,
		createData: { $type: "directory.evnt.component.link", url: "" } as LinkComponent,
		editComponent: EditComponentLink as FC<{ data: EditAtom<any> }>,
	},
	source: {
		label: { en: "Source" },
		desc: { en: "Canonical source of the event; official website, social media page etc." },
		icon: IconExternalLink,
		createData: { $type: "directory.evnt.component.source", url: "" } as SourceComponent,
		editComponent: EditComponentSource as FC<{ data: EditAtom<any> }>,
	},
	splashMedia: {
		label: { en: "Splash Media" },
		desc: { en: "Main media representing the event, shown in the header and event cards." },
		icon: IconPhoto,
		createData: { $type: "directory.evnt.component.splashMedia", media: { sources: [] }, roles: [] } as SplashMediaComponent,
		editComponent: EditComponentSplashMedia as FC<{ data: EditAtom<any> }>,
	},
	"app.bsky.richtext": {
		label: { en: "Rich Text (BlueSky)" },
		desc: { en: "Rich text content (BlueSky format)" },
		icon: IconLetterCase,
		createData: { $type: "app.bsky.richtext", text: "", facets: [] } as EventComponent,
		editComponent: EditComponentBlueSkyRichText as FC<{ data: EditAtom<any> }>,
	},
};

export * from "./types/Translations";
export * from "./types/PartialDate";
export * from "./types/Media";
export * from "./types/MediaSource";
export * from "./schemas/venue/Venue";
export * from "./schemas/EventData";
export * from "./schemas/EventInstance";
export * from "./schemas/enums/EventStatus";
export * from "./schemas/venue/PhysicalVenue";
export * from "./schemas/venue/OnlineVenue";
export * from "./schemas/venue/VenueType";
export * from "./schemas/components/EventComponent";
export * from "./schemas/components/LinkComponent";
export * from "./schemas/components/SourceComponent";
export * from "./schemas/components/SplashMediaComponent";

// Unstable
// export * from "./schemas/organizer/Organizer";
// export * from "./schemas/activity/EventActivity";

import type { EventData, $NSID } from "./schemas/EventData";
import type { } from "@atcute/lexicons/ambient";
declare module "@atcute/lexicons/ambient" {
	interface Records {
		[$NSID]: EventData & { $type: typeof $NSID };
	}
}


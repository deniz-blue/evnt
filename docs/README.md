🔙 [@evnt Project](../README.md)

**Open Evnt Specification v 0.1**

This document defines the data structures and types used for [Open Evnt](https://evnt.directory).

The main data structure is [`EventData`](#eventdata), which represents a single event. Event data should be represented as a JSON object.

See [Changelog](./CHANGELOG.md) for recent changes to the data format.

__Table of Contents__

- [Types](#types)
	- [`Translations`](#translations)
	- [`PartialDate`](#partialdate)
	- [`EventStatus`](#eventstatus)
	- [`Media`](#media)
		- [`MediaSource`](#mediasource)
- [`EventData`](#eventdata)
	- [Venues](#venues)
		- [`Venue`](#venue)
		- [`PhysicalVenue`](#physicalvenue)
		- [`OnlineVenue`](#onlinevenue)
		- [`UnknownVenue`](#unknownvenue)
	- [Instances](#instances)
		- [`EventInstance`](#eventinstance)
	- [Components](#components)
		- [Type `EventComponent`](#type-eventcomponent)
		- [`LinkComponent`](#linkcomponent)
		- [`SourceComponent`](#sourcecomponent)
		- [`SplashMediaComponent`](#splashmediacomponent)
		- [`app.bsky.richtext`](#appbskyrichtext)

# Types

## `Translations`

`Translations` are defined as a json object where the keys are **BCP47/IETF language tag** and values are `string` values.


```ts
interface Translations {
	[language: string]: string;
}
```

```js
{
	en: "Example",
	tr: "Örnek",
	lt: "Pavyzdys",
	"zh-Hans-CN": "示例",
}
```

Data consumers should try to use the user's language in the object and fall back (`undefined | ""`) to other values.

When creating or editing event data, applications;

- **should not** use machine translation to fill in missing translations, but rather leave them empty and let users fill them in manually. Applications can use machine translations when displaying event details to users if they want to, but they should not modify the original data with machine translations.

- should try to omit regional variants of languages when possible and just use the main language code (e.g. `en` instead of `en-US` or `en-GB`) unless the regional variant is necessary to distinguish between different languages (e.g. `zh-Hans-CN` vs `zh-Hant-TW`).

## `PartialDate`

A `PartialDate` is a **string** representing a date and/or time with varying levels of precision. It is designed to allow for representing dates where not all components are known or relevant.

`PartialDate` is adapted from [RFC 9557](https://www.rfc-editor.org/rfc/rfc9557) (which is based on RFC 3339 and ISO 8601) but with some modifications to better suit our use case.

A `PartialDate` can have four levels of precision: year, month, day and time. Each level of precision is optional, but they must be provided in order (i.e. you cannot have a day without a month or a month without a year).

A `PartialDate` **should** include an IANA Timezone identifier wrapped in square brackets at the end of the string to indicate the timezone of the date and time. If the timezone is not specified, it should be assumed to be in UTC for backwards compatibility.

A `PartialDate` must not include a timezone component (e.g. `Z` or `+02:00`) or a seconds component, as these are not supported by the format.

__Examples:__

- `2025[Europe/London]` - 2025 in the Europe/London timezone
- `2025-11[Europe/London]` - November 2025 in the Europe/London timezone
- `2025-11-12[Europe/London]` - 12th November 2025 in the Europe/London timezone
- `2025-11-12T11:00[Europe/London]` - 12th November 2025 at 11:00 (11 AM) in the Europe/London timezone
- `2021-11-03T00:00[Europe/London]` - 3rd November 2021 at 00:00 (midnight) in the Europe/London timezone

__Invalid examples:__

- ❌ `2025-11-12T11:00Z` - timezone component is not allowed
- ❌ `2025-11-12T11:00+02:00` - timezone component is not allowed
- ❌ `2025-11-12T11:00:00[Europe/London]` - seconds component is not allowed
- ❌ `2025-11-12T11[Europe/London]` - time component must include minutes
- ❌ `2025-11T11:00[Europe/London]` - time component cannot be provided without a day
- ❌ `2025T11:00[Europe/London]` - year cannot be provided without a month and day 

__ABNF Notation:__

```
partial-date = date [ "T" time ] [ "[" timezone "]" ]
date = year [ "-" month [ "-" day ] ]
time = hour ":" minute
year = 4DIGIT
month = 2DIGIT ; 01-12
day = 2DIGIT ; 01-31
hour = 2DIGIT ; 00-23
minute = 2DIGIT ; 00-59
timezone = *( ALPHA / DIGIT / "-" / "_" / "/" )
```

## `EventStatus`

The `EventStatus` enum defines the possible schedule/planning state of an event instance or the whole event. This enum does not define the tense of the event (past, present, future) but rather the current state of the event planning or execution.

__Table of variants__:

| Variant     | Description                                                                           | Date Validity |
|-------------|---------------------------------------------------------------------------------------|---------------|
| `planned`   | Default state - event is planned to occur or has occurred as scheduled.               | ✅             |
| `uncertain` | Uncertain - event might get cancelled, postponed etc.                                 | ❓             |
| `postponed` | Postponed to a later, unknown date.                                                   | ❌             |
| `cancelled` | The event has been cancelled and will not take place.                                 | ❌             |
| `suspended` | No guarantees if the event will continue as planned, will get postponed or cancelled. | ❌             |

__Note:__ The `planned` status is the default and should be used for events that are planned to occur or have occurred as scheduled. The other statuses should be used to indicate changes in the planning or execution of the event.

__Note:__ The "date validity" column in the table is how the dates of an event instance should be treated based on the status of the event. For `planned` events, the dates can be considered valid and can be used for scheduling and display purposes. For `uncertain`, `postponed`, `cancelled` and `suspended` events, the dates should be treated as potentially invalid or subject to change, and applications should take this into account when displaying or using the dates of these events. Applications can choose how to visually represent the different statuses of events, such as using different colors, icons or labels to indicate the status of an event instance.

__Graph__:

```mermaid
graph LR;
	planned --> uncertain
	planned --> postponed
	planned --> cancelled
	planned --> suspended
	
	uncertain ==> planned
	uncertain --> postponed
	uncertain --> cancelled
	uncertain --> suspended
	
	postponed ==> planned

	suspended ==> planned
	suspended --> postponed
	suspended --> cancelled
```

## `Media`

A `Media` object represents a media item, such as an image or video.

__Required fields:__

- `sources`: An array of [`MediaSource`](#mediasource)s.

__Optional fields:__

- `alt`: [`Translations`](#translations) representing alternative text for the media, which can be used for accessibility.
- `presentation`: Optional object for presentation information;
  - `blurhash`: [BlurHash](https://blurha.sh/)
  - `dominantColor`: Hex color code with hashtag representing the dominant color; example: `#ff0000` for red.

```ts
let media: Media = {
	sources: [
		{
			url: "https://www.example.com/image.jpg",
			mimeType: "image/jpeg",
			dimensions: { width: 800, height: 600 },
		},
	],
	alt: {
		en: "An example image",
	},
	presentation: {
		blurhash: "LEHV6nWB2yk8pyo0adR*.7kCMdnj",
		dominantColor: "#ff0000",
	},
};
```

### `MediaSource`

A `MediaSource` represents a source of a media item, such as an image or video.

__Required fields:__

- `url`: The URL of the media source.

__Optional fields:__

- `mimeType`: The MIME type of the media source, such as `image/jpeg`, `video/mp4` etc.
- `dimensions`: Optional object with `width` and `height` properties representing the dimensions of the media in pixels.

# `EventData`

The main data structure representing an event is `EventData`.

```ts
{
	v: "0.1",
	name: {
		en: "Example Event",
		lt: "Pavyzdys Renginys",
	},
}
```

__Required fields:__

- `v`: The version of the data format. Currently `"0.1"`. Required.
- `name`: [`Translations`](#translations); Required. The name of the event.

__Optional fields:__

- `venues`: Array of [`Venue`](#venue)s.
- `instances`: Array of [`EventInstance`](#eventinstance)s.
- `components`: Array of [`EventComponent`](#eventcomponent)s.

Consumers should not use `venues` to display a list of venues for an event, but rather use the `venueIds` field in `EventInstance` objects to link them together (`Venue` has a `id` field). This allows us to:
- Represent instances where we dont know the venue of an event instance (empty `venueIds` array).
- Represent instances where an event takes place in multiple venues simultaneously or is a hybrid event (multiple `venueIds`).
- Avoid displaying venues that are not relevant to a specific event instance.

- **Venues** represent **where** an event takes place.
- **Instances** represent **when** an event takes place.
- **Components** represent **additional information** (not tied to a specific venue or instance) about an event.

The smallest valid event data object is: `{ v: "0.1", name: {} }`.

For providing a description of an event, it is recommended to use a component (e.g. a custom `com.myapp.description` component or the `app.bsky.richtext` component).

## Venues

### `Venue`

A `Venue` represents a location where an event takes place.

__Required fields:__

- `id`: A **unique** identifier for the venue. This is used to link the venue to `EventInstance` objects.
- `type`: The type of the venue, either `physical`, `online` or `unknown`.
- `name`: The name of the venue as a [`Translations`](#translations) object.

Venue IDs are only valid per event and do not have to be globally unique. This means that two different events can have venues with the same ID without causing any conflicts. However, within a single event, all venue IDs must be unique.

Types of venues:
- [`PhysicalVenue`](#physicalvenue): A real-world location where an event takes place.
- [`OnlineVenue`](#onlinevenue): An online location where an event takes place, such as a website or streaming platform.
- [`UnknownVenue`](#unknownvenue): None of the above

### `PhysicalVenue`

A [`PhysicalVenue`](./SCHEMA.md#physicalvenue) represents a real-world location where an event takes place.

__Required fields:__

- `id`, `type`, `name` (inherited from `Venue`)
- `type` field must be set to `physical`

__Optional fields:__

- `address`: Optional physical address information.
- `coordinates`: Optional latitude and longitude coordinates.

_Examples_:

```ts
let venue: PhysicalVenue = {
	id: "venue-1",
	type: "physical",
	name: { en: "Central Park", es: "Parque Central" },
	address: {
		addr: "Central Park West & 5th Ave, New York, NY 10024, USA",
		countryCode: "US",
	},
	coordinates: { lat: 40.785091, lng: -73.968285 },
}
```

### `OnlineVenue`

An [`OnlineVenue`](./SCHEMA.md#onlinevenue) represents an online location where an event takes place, such as a website or streaming platform.

__Required fields:__

- `id`, `type`, `name` (inherited from `Venue`)
- `type` field must be set to `online`

__Optional fields:__

- `url`: The URL where the event can be accessed.

__Examples:__

```ts
let venue: OnlineVenue = {
	id: "venue-2",
	type: "online",
	name: { en: "YouTube Live" },
	url: "https://www.youtube.com/live/example",
}
```

### `UnknownVenue`

An `UnknownVenue` represents a venue that is not known if it is online or physical.

__Required fields:__

- `id`, `type`, `name` (inherited from `Venue`)
- `type` field must be set to `unknown`

This is primarily intended to be used for data scrapers when they know that an event has a venue but they cannot determine any information about it. This allows them to still link the event instance to a venue without having to provide any additional information.

## Instances

### `EventInstance`

An `EventInstance` represents a specific continuous occurrence of an event.

If an event has multiple occurrences (e.g., a conference with multiple days), each occurrence should be represented as a separate `EventInstance`.

If an event spans multiple days (such as a Game Jam or a Festival longer than 24 hours), it should be represented as a single `EventInstance` with a start and end date.

__Required fields:__

- `venueIds`: An array of strings linking this instance to one or more `Venue` objects. This field can be an empty array if the venue is not known.

__Optional fields:__

- `start`: A [`PartialDate`](#partialdate) representing the start date and/or time of the event instance
- `end`: A [`PartialDate`](#partialdate) representing the end date and/or time of the event instance
- `status`: An [`EventStatus`](#eventstatus) representing the current status of the event instance

__Note:__ The `start` and `end` fields are optional to allow for representing events where the date and time are not known or not relevant. However, if both `start` and `end` are provided, `end`'s PartialDate precision must be same or lower than `start`'s PartialDate precision (e.g. if `start` defines a date, `end` cannot define a specific time).

__Examples:__

```ts
let instance: EventInstance = {
	venueIds: ["venue-1"],
	start: "2025-11-12T10:00",
	end: "2025-11-12T18:00",
}

let event: EventData = {
	v: 0,
	name: { en: "Example Event" },
	venues: [
		{
			// Note! This ID is used to link the venue to the event instance
			id: "venue-1",
			type: "unknown",
			name: { en: "Example Venue" },
		},
	],
	instances: [
		instance,
	],
}
```

## Components

### Type `EventComponent`

An `EventComponent` represents additional information about an event that is not tied to a specific venue or instance. This can be used to represent links, sources or any other relevant information about an event.

An `EventComponent` has a `$type` field that defines the type of the component.

__Defined Component Types:__

| `$type`             | type                                          |
|---------------------|-----------------------------------------------|
| `link`              | [LinkComponent](#linkcomponent)               |
| `source`            | [SourceComponent](#sourcecomponent)           |
| `splashMedia`       | [SplashMediaComponent](#splashmediacomponent) |
| `app.bsky.richtext` | [AppBskyRichtextComponent](#appbskyrichtext)  |

Note that this list is **not exhaustive** and applications can define their own component types as needed. The only requirement is that the `$type` field should be a string.

⚠️ It is **strongly** recommended to prefix custom component types with the application name or a unique identifier to avoid conflicts with other applications (e.g. `myapp:customComponent`). If you define something with a generic name and coincidentally the specification later defines a component with the same name, it can cause conflicts and issues with data compatibility.

```ts
let component: EventComponent = {
	$type: "link",
	url: "https://www.example.com",
	name: { en: "Example Website" },
}
```

### `LinkComponent`

A `LinkComponent` represents a link related to the event, such as a website, social media page, ticketing page etc.

__Required fields:__

- `$type`: Must be set to `link`
- `url`: The URL of the link.

__Optional fields:__

- `name`: [`Translations`](#translations) representing the name of the link. This can be used to provide a human-readable name for the link, which can be displayed in applications instead of the raw URL.
- `disabled`: A boolean indicating whether the link is disabled. This can be used to represent links that are no longer valid or temporarily unavailable.
- `opensAt`: A [`PartialDate`](#partialdate) representing the date and/or time when the link becomes active or valid. This can be used for links that are not yet active but will become active in the future (e.g., a ticketing page that opens at a specific date and time).
- `closesAt`: A [`PartialDate`](#partialdate) representing the date and/or time when the link becomes inactive or invalid. This can be used for links that are only valid for a certain period of time (e.g., a form for registering to a competition that closes at a specific date and time).

### `SourceComponent`

A `SourceComponent` represents a source of information about the event, such as a news article, a social media post, an official announcement etc.

__Required fields:__

- `$type`: Must be set to `source`
- `url`: The URL of the source.

```ts
let source: SourceComponent = {
	$type: "source",
	url: "https://www.example.com/event-news",
}
```

### `SplashMediaComponent`

A `SplashMediaComponent` represents a media item (such as an image or video) that can be used as a splash media for the event.

Splash media is a media item that can be used to represent the event in a visual way, such as a cover image or a promotional video. This can be used by applications to display a visually appealing representation of the event.

__Required fields:__

- `media`: A [`Media`](#media) object representing the media item.
- `roles`: A string array representing the roles of the splash media. This can be used to differentiate between different types of splash media (e.g., `background`, `thumbnail`, `poster` etc.) and allow applications to choose the most appropriate media item for a specific context. The only currently defined role is `background`, but applications can define their own roles as needed.

### `app.bsky.richtext`

This component type can be used to represent rich text content related to the event. It uses the same format as the [Rich Text](https://docs.bsky.app/docs/advanced-guides/post-richtext) format defined by Bluesky, which allows for representing complex text content with formatting, links, mentions and other features.

This component was added for converting `community.lexicon.calendar.event` records from/to `EventData` objects, but applications can use it for any purpose they want.

```ts
let richtextComponent: AppBskyRichtextComponent = {
	$type: "app.bsky.richtext",
	text: "Go to this site to see more details",
	facets: [{
		index: { byteStart: 6, byteEnd: 15 },
		features: [{
			$type: "app.bsky.richtext.facet#link",
			uri: "https://example.com",
		}],
	}],
};
```

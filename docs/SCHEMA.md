# Event Data Schema

## EventData

An event

_Object containing the following properties:_

| Property        | Description                           | Type                                               |
| :-------------- | :------------------------------------ | :------------------------------------------------- |
| `$type`         | The type of the event data            | `'directory.evnt.event'`                           |
| **`v`** (\*)    | The version of the Event Data schema  | `'0.1'`                                            |
| **`name`** (\*) | The name of the event                 | [Translations](#translations)                      |
| `label`         | A secondary label for the event       | [Translations](#translations)                      |
| `status`        | The status of the event               | [EventStatus](#eventstatus)                        |
| `venues`        | The venues associated with this event | _Array of [Venue](#venue) items_                   |
| `instances`     | The instances of the event            | _Array of [EventInstance](#eventinstance) items_   |
| `components`    | Additional components of the event    | _Array of [EventComponent](#eventcomponent) items_ |

_(\*) Required._

## Address

_Object containing the following properties:_

| Property      | Description                                    | Type     |
| :------------ | :--------------------------------------------- | :------- |
| `countryCode` | The ISO 3166-1 alpha-2 country code            | `string` |
| `postalCode`  | The postal code of the address, if any         | `string` |
| `addr`        | Full address excluding country and postal code | `string` |

_All properties are optional._

## EventComponent

_Object containing the following properties:_

| Property         | Type     |
| :--------------- | :------- |
| **`$type`** (\*) | `string` |

_(\*) Required._

## EventInstance

A part of an event that can occur at a known or unknown date and/or time and a known or unknown place or places.

_Object containing the following properties:_

| Property            | Description                                                 | Type                        |
| :------------------ | :---------------------------------------------------------- | :-------------------------- |
| `id`                |                                                             | `string`                    |
| **`venueIds`** (\*) | The IDs of the venues where this event instance takes place | `Array<string>`             |
| `start`             | The start date and/or time                                  | [PartialDate](#partialdate) |
| `end`               | The end date and/or time                                    | [PartialDate](#partialdate) |
| `status`            | The status of the event instance                            | [EventStatus](#eventstatus) |

_(\*) Required._

## EventStatus

_Union of the following possible types:_

- `'planned'`
- `'uncertain'`
- `'postponed'`
- `'cancelled'`
- `'suspended'`

## LanguageKey

BCP37 language code

_String._

## LatLng

_Object containing the following properties:_

| Property       | Type     |
| :------------- | :------- |
| **`lat`** (\*) | `number` |
| **`lng`** (\*) | `number` |

_(\*) Required._

## LinkComponent

_Object containing the following properties:_

| Property         | Description                                         | Type                              |
| :--------------- | :-------------------------------------------------- | :-------------------------------- |
| **`$type`** (\*) | The type of the component                           | `'directory.evnt.component.link'` |
| **`url`** (\*)   | The URL of the link                                 | `string`                          |
| `name`           | The name of the link                                | [Translations](#translations)     |
| `disabled`       | Whether the link is disabled                        | `boolean`                         |
| `opensAt`        | The date and/or time when the link becomes active   | [PartialDate](#partialdate)       |
| `closesAt`       | The date and/or time when the link becomes inactive | [PartialDate](#partialdate)       |

_(\*) Required._

## MediaDimensions

The dimensions of a media item

_Object containing the following properties:_

| Property          | Description                       | Type                 |
| :---------------- | :-------------------------------- | :------------------- |
| **`width`** (\*)  | The width of the media in pixels  | `number` (_int, ≥0_) |
| **`height`** (\*) | The height of the media in pixels | `number` (_int, ≥0_) |

_(\*) Required._

## MediaPresentation

The presentation details of a media item

_Object containing the following properties:_

| Property        | Description                                                                        | Type     |
| :-------------- | :--------------------------------------------------------------------------------- | :------- |
| `blurhash`      |  A BlurHash representation of the media item                                       | `string` |
| `dominantColor` | The dominant color of the media item in hex rgb format (must start with a hashtag) | `string` |

_All properties are optional._

## Media

A media item, such as an image or video

_Object containing the following properties:_

| Property           | Description                                | Type                                                    |
| :----------------- | :----------------------------------------- | :------------------------------------------------------ |
| **`sources`** (\*) | The sources for the media item             | _Array of at least 1 [MediaSource](#mediasource) items_ |
| `alt`              | Alternative text for the media item        | [Translations](#translations)                           |
| `presentation`     | The presentation details of the media item | [MediaPresentation](#mediapresentation)                 |

_(\*) Required._

## MediaSource

A source for a media item.

_Object containing the following properties:_

| Property     | Description                           | Type                                                                                                                                                                                                                                                                                                                      |
| :----------- | :------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `url`        | The URL of the media source           | `string` (_url_)                                                                                                                                                                                                                                                                                                          |
| `blob`       | AT Protocol Blob                      | _Object with properties:_<ul><li>**`$type`** (\*): `'blob'`</li><li>**`ref`** (\*): _Object with properties:_<ul><li>**`$link`** (\*): `string` - CID</li></ul></li><li>**`size`** (\*): `number` (_int, ≥0_) - The size of the blob in bytes</li><li>**`mimeType`** (\*): `string` - The MIME type of the blob</li></ul> |
| `dimensions` | The dimensions of the media in pixels | [MediaDimensions](#mediadimensions)                                                                                                                                                                                                                                                                                       |
| `mimeType`   | The MIME type of the media            | `string`                                                                                                                                                                                                                                                                                                                  |

_All properties are optional._

## OnlineVenue

_Object containing the following properties:_

| Property         | Description                                   | Type                            |
| :--------------- | :-------------------------------------------- | :------------------------------ |
| **`$type`** (\*) |                                               | `'directory.evnt.venue.online'` |
| **`id`** (\*)    | ID of the venue to be used in Event Instances | `string`                        |
| **`name`** (\*)  | The name of the venue                         | [Translations](#translations)   |
| `url`            |                                               | `string`                        |

_(\*) Required._

## PartialDate

A date string that can have varying levels of precision (year, month, day, time) with a timezone

_String._

## PhysicalVenue

A venue with a known or unknown physical location

_Object containing the following properties:_

| Property         | Description                                   | Type                              |
| :--------------- | :-------------------------------------------- | :-------------------------------- |
| **`$type`** (\*) |                                               | `'directory.evnt.venue.physical'` |
| **`id`** (\*)    | ID of the venue to be used in Event Instances | `string`                          |
| **`name`** (\*)  | The name of the venue                         | [Translations](#translations)     |
| `address`        |                                               | [Address](#address)               |
| `coordinates`    | Approximate coordinates                       | [LatLng](#latlng)                 |

_(\*) Required._

## SourceComponent

A source of information about the event, such as a news article, a social media post, an official announcement etc.

_Object containing the following properties:_

| Property         | Description               | Type                                |
| :--------------- | :------------------------ | :---------------------------------- |
| **`$type`** (\*) | The type of the component | `'directory.evnt.component.source'` |
| **`url`** (\*)   | The URL of the source     | `string`                            |

_(\*) Required._

## SplashMediaComponent

_Object containing the following properties:_

| Property         | Description                             | Type                                                 |
| :--------------- | :-------------------------------------- | :--------------------------------------------------- |
| **`$type`** (\*) | The type of the component               | `'directory.evnt.component.splashMedia'`             |
| **`roles`** (\*) |                                         | _Array of [SplashMediaRole](#splashmediarole) items_ |
| **`media`** (\*) | A media item, such as an image or video | [Media](#media)                                      |

_(\*) Required._

## SplashMediaRole

_String._

## Translations

A multilingual string

_Object record with dynamic keys:_

- _keys of type_ [LanguageKey](#languagekey)
- _values of type_ `string` (_optional_)

## UnknownVenue

_Object containing the following properties:_

| Property         | Description                                   | Type                             |
| :--------------- | :-------------------------------------------- | :------------------------------- |
| **`$type`** (\*) |                                               | `'directory.evnt.venue.unknown'` |
| **`id`** (\*)    | ID of the venue to be used in Event Instances | `string`                         |
| **`name`** (\*)  | The name of the venue                         | [Translations](#translations)    |

_(\*) Required._

## Venue

_Union of the following possible types:_

- [PhysicalVenue](#physicalvenue)
- [OnlineVenue](#onlinevenue)
- [UnknownVenue](#unknownvenue)

## VenueType

_Enum, one of the following possible values:_

- `'directory.evnt.venue.physical'`
- `'directory.evnt.venue.online'`
- `'directory.evnt.venue.unknown'`

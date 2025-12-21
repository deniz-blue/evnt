# Event Data Schema

## EventData

An event

_Object containing the following properties:_

| Property             | Description                           | Type                                               |
| :------------------- | :------------------------------------ | :------------------------------------------------- |
| **`v`** (\*)         | The version of the Event Data schema  | `0`                                                |
| `id`                 |                                       | `string`                                           |
| **`name`** (\*)      | The name of the event                 | [Translations](#translations)                      |
| `description`        | A short description of the event      | [Translations](#translations)                      |
| `status`             | The status of the event               | [EventStatus](#eventstatus)                        |
| **`venues`** (\*)    | The venues associated with this event | _Array of [Venue](#venue) items_                   |
| **`instances`** (\*) | The instances of the event            | _Array of [EventInstance](#eventinstance) items_   |
| `components`         | Additional components of the event    | _Array of [EventComponent](#eventcomponent) items_ |

_(\*) Required._

## Address

_Object containing the following properties:_

| Property      | Description                                    | Type     |
| :------------ | :--------------------------------------------- | :------- |
| `countryCode` | The ISO 3166-1 alpha-2 country code            | `string` |
| `postalCode`  | The postal code of the address, if any         | `string` |
| `addr`        | Full address excluding country and postal code | `string` |

_All properties are optional._

## EventActivity

_Object containing the following properties:_

| Property        | Description                     | Type                          |
| :-------------- | :------------------------------ | :---------------------------- |
| `id`            |                                 | `string`                      |
| **`name`** (\*) | The name of the activity        | [Translations](#translations) |
| `description`   | The description of the activity | [Translations](#translations) |

_(\*) Required._

## EventComponent

_Union of the following possible types:_

- _Object with properties:_<ul><li>**`type`** (\*): `'link'`</li><li>**`data`** (\*): [LinkComponent](#linkcomponent)</li></ul>

## EventInstance

A part of an event that can occur at a known or unknown date and/or time and a known or unknown place or places.

_Object containing the following properties:_

| Property            | Description                                                 | Type                                             |
| :------------------ | :---------------------------------------------------------- | :----------------------------------------------- |
| `id`                |                                                             | `string`                                         |
| **`venueIds`** (\*) | The IDs of the venues where this event instance takes place | `Array<string>`                                  |
| `start`             | The start date and/or time                                  | [PartialDate](#partialdate)                      |
| `end`               | The end date and/or time                                    | [PartialDate](#partialdate)                      |
| `status`            | The status of the event instance                            | [EventStatus](#eventstatus)                      |
| `activities`        | The activities taking place during this event instance      | _Array of [EventActivity](#eventactivity) items_ |

_(\*) Required._

## EventStatus

_Union of the following possible types:_

- `'planned'`
- `'uncertain'`
- `'postponed'`
- `'cancelled'`
- `'suspended'`

## LanguageKey

BCP37 or ISO 639-1 language code

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

| Property            | Description                                         | Type                          |
| :------------------ | :-------------------------------------------------- | :---------------------------- |
| **`url`** (\*)      | The URL of the link                                 | `string`                      |
| `name`              | The name of the link                                | [Translations](#translations) |
| `description`       | A description of the link                           | [Translations](#translations) |
| **`disabled`** (\*) | Whether the link is disabled                        | `boolean`                     |
| `opensAt`           | The date and/or time when the link becomes active   | [PartialDate](#partialdate)   |
| `closesAt`          | The date and/or time when the link becomes inactive | [PartialDate](#partialdate)   |

_(\*) Required._

## OnlineVenue

_Object containing the following properties:_

| Property             | Description                                   | Type                          |
| :------------------- | :-------------------------------------------- | :---------------------------- |
| **`venueType`** (\*) |                                               | `'online'`                    |
| **`venueId`** (\*)   | ID of the venue to be used in Event Instances | `string`                      |
| **`venueName`** (\*) | The name of the venue                         | [Translations](#translations) |
| `url`                |                                               | `string`                      |

_(\*) Required._

## Organizer

_Object containing the following properties:_

| Property        | Description                             | Type                          |
| :-------------- | :-------------------------------------- | :---------------------------- |
| `id`            |                                         | `string`                      |
| **`name`** (\*) | The name of the organizer               | [Translations](#translations) |
| `avatarUrl`     | The URL of the organizer's avatar image | `string` (_url_)              |

_(\*) Required._

## PartialDate

An ISO 8601 date and time string that may be incomplete (e.g. '2023', '2023-05') and does not include timezone information (forced UTC)

_String._

## PhysicalVenue

A venue with a known or unknown physical location

_Object containing the following properties:_

| Property             | Description                                   | Type                          |
| :------------------- | :-------------------------------------------- | :---------------------------- |
| **`venueType`** (\*) |                                               | `'physical'`                  |
| **`venueId`** (\*)   | ID of the venue to be used in Event Instances | `string`                      |
| **`venueName`** (\*) | The name of the venue                         | [Translations](#translations) |
| `address`            |                                               | [Address](#address)           |
| `coordinates`        | Approximate coordinates                       | [LatLng](#latlng)             |
| `googleMapsPlaceId`  |                                               | `string`                      |

_(\*) Required._

## Translations

A multilingual string

_Object record with dynamic keys:_

- _keys of type_ [LanguageKey](#languagekey)
- _values of type_ `string` (_optional & nullable_)

## Venue

_Union of the following possible types:_

- [PhysicalVenue](#physicalvenue)
- [OnlineVenue](#onlinevenue)

## VenueType

_Enum, one of the following possible values:_

- `'physical'`
- `'online'`

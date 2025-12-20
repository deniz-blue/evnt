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

## BaseVenue

_Object containing the following properties:_

| Property             | Description                                   | Type                          |
| :------------------- | :-------------------------------------------- | :---------------------------- |
| **`venueId`** (\*)   | ID of the venue to be used in Event Instances | `string`                      |
| **`venueName`** (\*) | The name of the venue                         | [Translations](#translations) |

_(\*) Required._

## EventComponent

_Union of the following possible types:_

- _Object with properties:_<ul><li>**`type`** (\*): `'link'`</li><li>**`data`** (\*): [LinkComponent](#linkcomponent)</li></ul>

## EventInstance

A part of an event that can occur at a known or unknown date and/or time and a known or unknown place or places.

_Object containing the following properties:_

| Property            | Description                                                 | Type                        |
| :------------------ | :---------------------------------------------------------- | :-------------------------- |
| `id`                |                                                             | `string`                    |
| **`venueIds`** (\*) | The IDs of the venues where this event instance takes place | `Array<string>`             |
| `start`             |                                                             | [PartialDate](#partialdate) |
| `end`               |                                                             | [PartialDate](#partialdate) |

_(\*) Required._

## LanguageKey

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

| Property            | Type                          |
| :------------------ | :---------------------------- |
| **`url`** (\*)      | `string`                      |
| `name`              | [Translations](#translations) |
| `description`       | [Translations](#translations) |
| **`disabled`** (\*) | `boolean`                     |
| `opensAt`           | [PartialDate](#partialdate)   |
| `closesAt`          | [PartialDate](#partialdate)   |

_(\*) Required._

## OnlineVenue

_Object containing the following properties:_

| Property             | Description                                   | Type                          |
| :------------------- | :-------------------------------------------- | :---------------------------- |
| **`venueId`** (\*)   | ID of the venue to be used in Event Instances | `string`                      |
| **`venueName`** (\*) | The name of the venue                         | [Translations](#translations) |
| **`venueType`** (\*) |                                               | `'online'`                    |
| `url`                |                                               | `string`                      |

_(\*) Required._

## PartialDate

_String._

## PhysicalVenue

A venue with a known or unknown physical location

_Object containing the following properties:_

| Property             | Description                                   | Type                          |
| :------------------- | :-------------------------------------------- | :---------------------------- |
| **`venueId`** (\*)   | ID of the venue to be used in Event Instances | `string`                      |
| **`venueName`** (\*) | The name of the venue                         | [Translations](#translations) |
| **`venueType`** (\*) |                                               | `'physical'`                  |
| `address`            |                                               | [Address](#address)           |
| `coordinates`        | Approximate coordinates                       | [LatLng](#latlng)             |
| `googleMapsPlaceId`  |                                               | `string`                      |

_(\*) Required._

## Translations

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

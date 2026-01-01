# Deniz's Structured Event Data Format

A data format for defining any kind of event, big or small.

The current schema is [defined using Zod4](../packages/schema); exported to [json schema](../event-data.schema.json) and [markdown](./SCHEMA.md).

## Design Goals

- Use as many international standards as possible (ISO etc)
- Prefer machine readable values rather than human readable values
- Support partial states and unknown values (for example, events with unannounced dates or locations)
- Be able to describe all kinds of events from concerts, workshops, cosplay conventions, academic exams/lectures to online/hybrid meetings and/or events.

Considerations:
- [x] Multilingual events
- [ ] Media URLs
- [ ] Age restricted events
- [ ] Embedding external URLs to other event listing sites or the event's website
- [ ] Events with multiple ticket types
- [ ] Events that require an attendance form
- [ ] Events that require membership to an organization (private events)

## Definitions

### `Translations`

`Translations` are defined as a json object where the keys are **BCP47**/**ISO 639-1** language codes and values are `string` or `null` values.

```ts
interface Translations {
  [language: string]: string | null;
}
```

```js
{ en: "Example", tr: "Örnek", lt: "Pavyzdys" }
```

  Data consumers should try to use the user's language in the object and fall back to the `en` key (if the key is not in the object or the value is an empty string `""` or `null`)

### `PartialDate`

A `PartialDate` is defined as a modified [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) date and time string.
  
The value does not include a `Z` timezone component and all values are forced to be in **UTC** timezone.

The time part of the string is optional, if omitted, the `T` substring should not exist.

If there is no time specified, the date (day of the month) and month are also optional.

Examples:
- `2025`
- `2025-11`
- `2025-11-12`
- `2025-11-12T11:00`
- `2021-11-03T00:00`

This type allows us to define dates where we dont know enough information to define a full date. An event might be known to take place on April but the exact day might be unknown.

## RFC

### Physical Addresses

Addresses are really complicated and there is not any size-fits-all solution.
`Address#addr: string?` and `Address#postalCode: string?` is the current solution which is a full address and a postal code in the context of the country.
Trying to include even the first subdivision (ex. city) of an address becomes too much of a hassle.

### Attendance Requirements

We could have a `attendance requirements` field in `EventInstance` which includes a discriminated enum (like `EventComponent`)
which would have variants like `"ticket"`, `"part_of_group"` or `"filled_form"` etc.

But how can we handle cases like "to attend this event you must either be a part of our club **or** fill this form along with buying a ticket"
which creates a relation `part_of_group || (filled_form && ticket)`

To solve this we might seperate the "requirements" into its own array of "attending stuff" which "attendance requirements" would reference by id?

Cl\*ude gave 2 options, Ch\*tGPT also outlined the second:

```ts
attendanceRequirements?: AttendanceRequirement[];
attendanceLogic?: string; // e.g., "membership || (form && ticket)"
```

```ts
attendanceRequirement?: AttendanceLogic;

type AttendanceLogic =
  | { type: "requirement", data: AttendanceRequirement }
  | { type: "and", requirements: AttendanceLogic[] }
  | { type: "or", requirements: AttendanceLogic[] }
```

It looks like we need a way to define all the rules and have relations between them seperately.

### Announcements

Should **announcements** be in its own field or should it be a type of `EventComponent`?
Announcements are for things like "this event has been postponed due to xyz" or "event venue will be rainy" etc messages.

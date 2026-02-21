🔙 [@evnt Project](../README.md)

Jump to:
- [Prior Art](#prior-art)
- [Differences from other formats](#differences-from-other-formats)

## Prior Art

Back when I started going to cosplay conventions, in Turkey specifically, I had issues finding events and gathering information (date, time, place, price) about them. I created an instagram profile for announcing any events I came accross so others could find them too. After a while, I realized one crucial issue: properties of events are volatile, and can change; instagram posts cannot.

To solve this issue, I started developing a [website](https://events.deniz.blue) for keeping a list of these events where users could follow events and recieve push notifications whenever something changes. At first I entered all the data manually, but the main idea was that event organizers would authenticate and update event data themselves. After a while, I noticed the need for i18n and implemented it, along with some other niche features. Developing the website sure took a while but it gave me valuable insight for the current event data format we are defining right here.

## Differences from other formats

This project aims to solve many fundamental issues present in other data formats for representing events.

- **Multilingual by Design**: The event data format is designed to be multilingual from the ground up, allowing for easy localization and internationalization. See [Translations](./README.md#translations) type.
- **Instances**: An event can have multiple instances, each with its own start and end times. This allows for recurring events or events that take place on multiple dates.
- **Partial Dates**: Start and end times can be partial, meaning that they can not include all components (e.g., only the date without the time). This allows for events that have uncertain or flexible timing. Start and end times are also optional, allowing for events that do not have a specific time frame.
- **Forced UTC**: All date and time values are in UTC, which eliminates issues with time zones and daylight saving time.
- **Venues**:
  - **Types**: Venues can be of three types: "physical", "online" and "unknown".
  - **Multiple Venues**: An event can have multiple venues per each instance. This allows for events that take place in multiple locations or have both physical and online components.
  - **No Naive Address Representation**: The event data format does not include a structured representation for addresses (e.g., "street", "city", "country"). Instead, it allows for a string "address" property that can be used to represent the address in a flexible way. This is because addresses can be complex and vary greatly across different regions and cultures, and a naive representation may not be sufficient for all cases.
- **No Temporal State**: Events do not have a temporal state (e.g., "upcoming", "ongoing", "past"). This can be derived from the start and end times, and is not a property of the event itself.
- **No Derived/Redundant Properties**: Properties that can be derived from other properties (e.g., "duration" from "start" and "end") are not included in the event data format.

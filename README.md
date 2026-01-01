# @evnt

Links:
- 📜 [Data Format Specification](./docs/README.md)
  - 💎 [Zod Schema](./packages/schema/), which generate:
    - [JSON Schema](./event-data.schema.json)
    - [Markdown Documentation](./docs/SCHEMA.md)
- [Redirector](./apps/redirector#readme)
  - 🌐 [event.nya.pub](https://event.nya.pub)
- [Web App](./apps/web#readme) (example app that uses the format & APIs)
  - 🌐 [devent.pages.dev](https://devent.pages.dev)
- [data-server](./apps/data-server#readme) (example wip server)

A big project consisting of other smaller projects to attempt to solve the issue of event information management.

## Prior Art

Back when I started going to cosplay conventions, in Turkey specifically, I had issues finding events and gathering information (date, time, place, price) about them. I created an instagram profile for announcing any events I came accross so others could find them too. After a while, I realized one crucial issue: properties of events are volatile, and can change; instagram posts cannot.

To solve this issue, I started developing a [website](https://events.deniz.blue) for keeping a list of these events where users could follow events and recieve push notifications whenever something changes. At first I entered all the data manually, but the main idea was that event organizers would authenticate and update event data themselves. After a while, I noticed the need for i18n and implemented it, along with some other niche features. Developing the website sure took a while but it gave me valuable insight for the current event data format we are defining right here.

This monorepo aims to fix these issues with the other related projects:
- A single master [event data format](./docs/README.md) to [rule them all](https://xkcd.com/927/)
- A way to [share and open](./apps/redirector#readme) event information in your preferred application
- A default [web app](./apps/web#readme) to view events from many sources
- A [server](./apps/data-server#readme) that allows users to collaboratively store and update event data

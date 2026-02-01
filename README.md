# <img src="https://github.com/deniz-blue/md-emojis/raw/main/emojis/denizblue/evnt.svg" width="32px" /> @evnt

A **standardized**, **open-source** data **format** for representing and sharing event data across different applications.

_Links:_

- [About](#about-evnt)
- 📱 [Applications](#applications)
- 📜 [Data Format Specification](./docs/README.md)
  - [@evnt/schema](./packages/schema/) package
  - [JSON Schema](./event-data.schema.json) _(generated)_
  - [Markdown Documentation](./docs/SCHEMA.md) _(generated)_
  - [ATProto Lexicon](./event-data.lexicon.json) _(generated, also bad)_
- 🔗 [Application Links Format](./docs/LINKS.md) _event.nya.pub_

## Applications

| Name                                      | Description     | Plat.                                                                                                                 | Lang.    | Source Code                                                 |
|-------------------------------------------|-----------------|-----------------------------------------------------------------------------------------------------------------------|----------|-------------------------------------------------------------|
| **[Vantage](https://vantage.deniz.blue)** | Example Web App | 🌐                                                                                                                    | TS+React | [./apps/web](./apps/web)                                    |
| **Event Viewer**                          | Kuylar's WIP    | <img src="https://github.com/deniz-blue/md-emojis/raw/main/emojis/platform/android.svg" align="center" height="24" /> | Kotlin   | [kuylar/EventViewer](https://github.com/kuylar/EventViewer) |

Applications are the different clients that can be used to view and interact with events. Each application may have its own features and user interface. These applications should support the [Application Links Format](./docs/LINKS.md).

## Event Repositories

An easy way to share and distribute event data is through event repositories which use GitHub pages. You can use [this template repository](https://github.com/deniz-blue/events-repo-template) to create your own event repository.

A list of event repositories:
- [deniz-blue/events-data](https://github.com/deniz-blue/events-data): FOSS, tech, other public events.
- [deniz-blue/events-data-scraped](https://github.com/deniz-blue/events-data-scraped): Scraped event data from various sources.

_Open an issue or PR to add your event repository to this list_


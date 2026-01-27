# @evnt

A standardized open format for representing and sharing event data across different applications.

_Links:_

- 📜 [Data Format Specification](./docs/README.md)
  - [@evnt/schema](./packages/schema/) (Zod schema & validator)
  - [(Generated) JSON Schema](./event-data.schema.json)
  - [(Generated) Markdown Documentation](./docs/SCHEMA.md)
- 🔗 [Application Links Format](./docs/LINKS.md)

## Applications

| Name             | Description     | Platform | Link                                             | Source Code                                          |
|------------------|-----------------|----------|--------------------------------------------------|------------------------------------------------------|
| **Vantage**      | Example Web App | Web      | [vantage.deniz.blue](https://vantage.deniz.blue) | [Source Code](./apps/web)                            |
| **Event Viewer** | Kuylar's WIP    | Android  | N/A                                              | [Source Code](https://github.com/kuylar/EventViewer) |

Applications are the different clients that can be used to view and interact with events. Each application may have its own features and user interface. These applications should support the [Application Links Format](./docs/LINKS.md).

## Event Repositories

An easy way to share and distribute event data is through event repositories which use GitHub pages. You can use [this template repository](https://github.com/deniz-blue/events-repo-template) to create your own event repository.

A list of event repositories:
- [deniz-blue/events-data](https://github.com/deniz-blue/events-data): FOSS, tech, other public events.

_Open an issue or PR to add your event repository to this list_


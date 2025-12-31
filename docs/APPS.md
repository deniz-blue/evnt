# Apps

## Redirector

The redirector (currently `event.nya.pub`) allows users to use their preferred event viewing/tracking website/application.

The redirector will show a list of public apps ([data/instances.json](../data/instances.json)) when the user has not set a default app to handle links.

Event viewing/tracking applications should use the redirector domain while sharing events in the [Format spec](./README.md)

#### Redirector API

- You can redirect to `event.nya.pub` with a few `?` search query parameters:
  - `?setInstanceUrl=...` sets the instance url
  - `?clearInstanceUrl` clears the instance url
  - `?popup` to close the popup after operation
- You can create an `<iframe>` with src `event.nya.pub/?iframe` to get a messaging API which you can use to check if you are the default instance:
  - recieve `{ type: "ready" }`
  - send `{ type: "isDefaultInstance" }`
  - recieve `{ type: "state", isDefaultInstance: boolean }`
  - recieve `{ type: "instanceChanged" }`

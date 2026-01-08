🔙 [@evnt Project](../README.md)

Table of contents:
- [Redirector](#redirector)
    - [Redirector API](#redirector-api)
- [Web App](#web-app)

## Redirector

[Live Website](https://event.nya.pub) / [Source Code](../apps/redirector)

The redirector acts as a bridge between apps that use the [@evnt Event Format](../README.md); apps share links to the redirector and the redirector takes users to their preferred applications (called instances).

If the user does not have a default instance, a list of public apps ([data/instances.json](../data/instances.json)) are shown in the redirector.

#### Redirector API

You can redirect to `event.nya.pub` with a few `?` search query parameters:

- Redirects if `?action` or `?r` are defined
- `?setInstanceUrl=<url>` sets the instance url
- `?clearInstanceUrl` clears the instance url
- `?popup` to close the popup after operation

## Web App

[Live Instance](https://devent.pages.dev) / [Source Code](../apps/web)

The web app acts as an example application to view and save events.

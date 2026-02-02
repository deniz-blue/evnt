🔙 [@evnt Project](../README.md)

# `EventSource`

An `EventSource` is an URI that represents the source of an event.

```ts
type EventSource = `${"http" | "https" | "at"}://${string}`;
```

**Valid schemes:**
- `http` / `https`: Direct link to an event JSON file
- `at`: AT Protocol Record URI;
  - content should be `EventData`
  - recommended to use collection `blue.deniz.event`
  - prefer `did` identifiers rather than handles

**Examples:**
- `https://deniz.blue/events-data/events/2024/foss/fosdem24.json`
- `at://did:plc:ir2qabq56znbbinhktehjmc6/blue.deniz.event/3mdsliedwur2j`

Applications can use the `local:` scheme to represent local files, but this is application-specific and not part of the standard.

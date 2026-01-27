🔙 [@evnt Project](../README.md)

# Layers

A **layer** is defined as a collection of events. Layers contain a list of `EventSource` objects, which represent the sources of events within that layer.

```ts
type LayerData = {
	events: EventSource[];

	// Subject to change
	name?: Translations;
	color?: string;
};
```

User-data servers can store multiple `LayerData` per user so applications can sync layers across devices.

Applications can use layers to organize and manage events from various sources effectively. They're the same as "calendars" in many calendar applications.

```ts
// Application specific code
// This is just for example

type Layer = {
	uuid: string;
	data: LayerData;
	sync: SyncInfo | null;
};

type SyncInfo = {
	syncUserId: string;
	syncUrl: string;
	etag: string | null;
	lastSynced: number | null;
};
```

## `EventSource`

An `EventSource` is an object that represents the source of an event.

```ts
type EventSource = {
	type: "local";
	uuid: string; // UUID of the event saved in local storage
} | {
	type: "remote";
	url: string; // URL (https:// or at://) of the remote event source
};
```

Applications can use this structure to identify and manage different event sources, whether they are local or remote.

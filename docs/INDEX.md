🔙 [@evnt Project](../README.md)

# `.index.json` Format

The `.index.json` file is used to provide a list of available events in an events repository. You may develop your own index format, but the following is a suggested structure.

```ts
type Index = {
	events: Entry[];
};

type Entry = {
	path: string; // Path to the event JSON file
	lastModified?: number; // Unix timestamp of the last modification time
};
```



# Vantage

A reference web application for viewing events.

## Diagram

```mermaid
flowchart

	subgraph Data
		Store[Persisted Zustand Store]@{ shape: win-pane }
		Layer[EventLayer]@{ shape: hexagon }
		EventSource["EventSource (URI)"]@{ shape: hexagon }
		Database[Database]@{ shape: lin-cyl } 
		Envelope[EventEnvelope]@{ shape: hexagon }
		EventData["EventData | null"]@{ shape: document }

		Store -->|Includes many| Layer
		Layer -->|Includes many| EventSource
		EventSource -->|Used as Database Key| Database
		Database -->|Contains| Envelope
		Envelope --->|Contains| EnvelopeError["Last fetch error"]@{ shape: hexagon }
		Envelope -->|Contains| EventData
		Envelope --->|Contains| EnvelopeRevision["Revision Data"]@{ shape: hexagon }
	end

	subgraph Resolution
		Resolver[EventResolver]@{ shape: subproc }
		Network[Network]@{ shape: stadium }

		Resolver <-.->|Read cache<br>Write outcome| Database
		Resolver -->|HTTP Fetch| Network
	end

	Jetstream[Jetstream]@{ shape: stadium }
	Jetstream --->|Requests| Resolver

	Query[React Query]@{ shape: lin-rect }
	Query -->|Uses| Resolver
	Query -->|Query Key| EventSource
```

## Development

- Go to [this link](https://event.nya.pub/?setInstanceUrl=http://127.0.0.1:5173) to set the instance URL for development 

```bash
cd apps/web
pnpm i
pnpm dev
```




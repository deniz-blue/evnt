🔙 [@evnt Project](../README.md)

# Application Links Format

A link format is defined to allow applications to link to the redirector with specific actions to be performed. 

When sharing events with other users, applications should link to the redirector; the redirector will then forward the user to their preferred application to view the event.

If the user does not have a preferred application, a list of public applications ([data/instances.json](../data/instances.json)) are shown in the redirector.

```mermaid
graph LR
	A([Application A])
	B([Application B])
	C([Application C])

	Redirector -.-> A
	Redirector -.-> B
	Redirector -->|Preference| C

	A -->|Share Link| Redirector
```

Application Links use **URL search parameters** to define the action to be performed.

The operations are differentiated by the `action` parameter:

- `view-event`: View a single event
  
  **Parameters:**
  - `url`: If defined, the event is fetched from this URL (should be a direct link to a raw event JSON)

  _Example usage:_
  
  ```
  https://event.nya.pub/?action=view-event&url=https://example.com/event.json
  ```

  _Test link:_ [FOSDEM26](<https://event.nya.pub/?action=view-event&url=https%3A%2F%2Fdeniz.blue%2Fevents-data%2Fevents%2F2026%2Ffoss%2Ffosdem26.json>)

## Special Parameters

- `?setInstanceUrl=<url>` sets the instance url
- `?clearInstanceUrl` clears the instance url
- `?popup` to close the popup after operation

Example usage:

```
https://event.nya.pub/?setInstanceUrl=https://example.com/
```

_Test link:_ [Set Instance URL to localhost:5173](https://event.nya.pub/?setInstanceUrl=http://localhost:5173/)

_Test link:_ [Clear Instance URL](https://event.nya.pub/?clearInstanceUrl)

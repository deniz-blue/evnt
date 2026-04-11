import type { EventComponent, KnownEventComponent } from "@evnt/schema";
import type { EventBuilder } from "../EventBuilder";

export class ComponentBuilder<
	Type extends KnownEventComponent["$type"],
	Component extends Extract<KnownEventComponent, { $type: Type }> = Extract<KnownEventComponent, { $type: Type }>
> {
	component: Component;
	parent?: EventBuilder;
	constructor(component: Component, parent?: EventBuilder) {
		this.component = component;
		this.parent = parent;
	}

	build(): EventComponent {
		return this.component;
	}
};

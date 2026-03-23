import type { EventComponent, KnownEventComponent } from "@evnt/schema";
import type { EventBuilder } from "../EventBuilder";

export class ComponentBuilder<Type extends KnownEventComponent["type"], Data = Extract<KnownEventComponent, { type: Type }>["data"]> {
	component: { type: Type; data: Data };
	parent?: EventBuilder;
	constructor(component: { type: Type; data: Data }, parent?: EventBuilder) {
		this.component = component;
		this.parent = parent;
	}

	build(): EventComponent {
		return this.component as EventComponent;
	}
};

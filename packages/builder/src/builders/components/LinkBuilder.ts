import type { LinkComponent, PartialDate } from "@evnt/schema";
import { ComponentBuilder } from "./ComponentBuilder";
import type { EventBuilder } from "../EventBuilder";
import { createTranslationAdder } from "../../utils/helpers";

export class LinkBuilder extends ComponentBuilder<"directory.evnt.component.link"> {
	constructor(data: LinkComponent = { $type: "directory.evnt.component.link", url: "" }, parent?: EventBuilder) {
		super(data, parent);
	}

	setUrl(url: string) {
		this.component.url = url;
		return this;
	}

	setName = createTranslationAdder(() => this.component.name ??= {}, this);

	setDisabled(disabled: boolean) {
		this.component.disabled = disabled;
		return this;
	}

	setOpensAt(opensAt: PartialDate) {
		this.component.opensAt = opensAt;
		return this;
	}

	setClosesAt(closesAt: PartialDate) {
		this.component.closesAt = closesAt;
		return this;
	}
}

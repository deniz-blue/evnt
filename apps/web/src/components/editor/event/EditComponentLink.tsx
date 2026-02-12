import { Input, SimpleGrid, Stack, TextInput } from "@mantine/core";
import { Deatom, DeatomOptional, type EditAtom } from "../edit-atom";
import type { LinkComponent } from "@evnt/schema";
import { focusAtom } from "jotai-optics";
import { TranslationsInput } from "../../base/input/TranslationsInput";
import { ClearableSwitch } from "../../base/input/ClearableSwitch";
import { PartialDateInput } from "../../base/input/PartialDateInput";
import { UtilPartialDate } from "@evnt/schema/utils";

export const EditComponentLink = ({ data }: { data: EditAtom<LinkComponent> }) => {
	return (
		<Stack>
			<Deatom
				atom={focusAtom(data, o => o.prop("url"))}
				component={TextInput}
				label="URL"
				placeholder="https://example.com"
				withAsterisk
				required
				type="url"
			/>

			<Stack gap={4}>
				<Stack gap={0}>
					<Input.Label>Link Name</Input.Label>
					<Input.Description>
						Name for the link, e.g. "Registration" or "Livestream". Optional, but can help users understand the purpose of the link.
					</Input.Description>
				</Stack>
				<DeatomOptional
					atom={focusAtom(data, o => o.prop("name"))}
					component={TranslationsInput}
					set={{}}
					setLabel="Add Link Name"
					placeholder="Name for the link, e.g. 'Registration' or 'Livestream'"
				/>
			</Stack>

			<Deatom
				component={ClearableSwitch}
				atom={focusAtom(data, o => o.prop("disabled").valueOr(false))}
				label="Disabled"
				description="If disabled, the link will be shown as disabled and not clickable. Useful for indicating upcoming links or temporarily unavailable links."
				color="red"
			/>

			<SimpleGrid type="container" cols={{ base: 1, "450px": 2 }}>
				{(["opensAt", "closesAt"] as const).map((field) => (
					<Stack gap={4} key={field}>
						<Stack gap={0}>
							<Input.Label>{field == "opensAt" ? "Opens at" : "Closes at"}</Input.Label>
							<Input.Description>
								{field == "opensAt" ? "When the link starts being available" : "When the link stops being available; such as the end of registrations"}
							</Input.Description>
						</Stack>
						<DeatomOptional
							component={PartialDateInput}
							atom={focusAtom(data, o => o.prop(field))}
							set={() => UtilPartialDate.thisMonth()}
						/>
					</Stack>
				))}
			</SimpleGrid>
		</Stack>
	)
};

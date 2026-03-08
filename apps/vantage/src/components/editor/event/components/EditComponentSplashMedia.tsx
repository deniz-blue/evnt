import { Stack, TagsInput, Text, TextInput } from "@mantine/core";
import { Deatom, type EditAtom } from "../../edit-atom";
import type { SplashMediaComponent, SplashMediaRole } from "@evnt/schema";
import { focusAtom } from "jotai-optics";
import { EditMedia } from "../media/EditMedia";

export const EditComponentSplashMedia = ({ data }: { data: EditAtom<SplashMediaComponent> }) => {
	return (
		<Stack>
			<EditMedia data={focusAtom(data, o => o.prop("media"))} />
			<Deatom
				component={SplashMediaRolesInput}
				atom={focusAtom(data, (o) => o.prop("roles"))}
			/>
		</Stack>
	)
};

export const SplashMediaRolesInput = ({
	value,
	onChange,
}: {
	value: SplashMediaRole[];
	onChange: (roles: SplashMediaRole[]) => void;
}) => {
	return (
		<TagsInput
			label="Roles"
			description="The role(s) this media serves. E.g. background, poster, thumbnail, banner, etc."
			value={value}
			onChange={onChange}
			placeholder="..."
			data={["background"] as SplashMediaRole[]}
		/>
	);
};

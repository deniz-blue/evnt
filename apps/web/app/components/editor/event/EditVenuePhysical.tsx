import type { Address, PhysicalVenue } from "@evnt/schema";
import { Deatom, DeatomOptional, type EditAtom } from "../edit-atom";
import { Button, CloseButton, Group, Stack, Text } from "@mantine/core";
import { ClearableTextInput } from "../../base/input/ClearableTextInput";
import { focusAtom } from "jotai-optics";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { useMemo } from "react";

export const EditVenuePhysical = ({ data }: { data: EditAtom<PhysicalVenue> }) => {
	const hasAddress = useAtomValue(useMemo(() => atom((get) => !!get(data).address), [data]));
	const addAddress = useSetAtom(useMemo(() => atom(null, (get, set) => {
		set(data, prev => ({
			...prev,
			address: {},
		}));
	}), [data]));
	const deleteAddress = useSetAtom(useMemo(() => atom(null, (get, set) => {
		set(data, prev => ({
			...prev,
			address: undefined,
		}));
	}), [data]));

	return (
		<Stack>
			<Text fw="bold">Physical Venue Details</Text>

			{hasAddress ? (
				<EditAddress
					data={focusAtom(data, o => o.prop("address").valueOr({})) as EditAtom<Address>}
					onDelete={deleteAddress}
				/>
			) : (
				<Button onClick={addAddress}>Add Address Details</Button>
			)}
		</Stack>
	)
};

export const EditAddress = ({
	data,
	onDelete,
}: {
	data: EditAtom<Address>;
	onDelete?: () => void;
}) => {
	return (
		<Stack>
			<Group justify="space-between">
				<Text fw="bold">Address</Text>
				{onDelete && <CloseButton onClick={onDelete} />}
			</Group>
			<Deatom
				component={CountryCodePicker}
				atom={focusAtom(data, o => o.prop("countryCode"))}
			/>
			<DeatomOptional
				component={ClearableTextInput}
				atom={focusAtom(data, o => o.prop("addr"))}
				set={() => ""}
				setLabel="Add Address Line"
				label="Address Line"
			/>
			<DeatomOptional
				component={ClearableTextInput}
				atom={focusAtom(data, o => o.prop("postalCode"))}
				set={() => ""}
				setLabel="Add Postal Code"
				label="Postal Code"
			/>
		</Stack>
	)
};

export const CountryCodePicker = ({
	value,
	onChange,
}: {
	value: string | undefined;
	onChange: (value: string | undefined) => void;
}) => {
	return (
		<div />
	);
};

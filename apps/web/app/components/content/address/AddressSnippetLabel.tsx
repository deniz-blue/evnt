import type { Address } from "@evnt/schema";
import { Text } from "@mantine/core";
import { CountryFlag } from "./CountryFlag";

export const AddressSnippetLabel = ({ value }: { value: Address }) => {
    return (
        <Text fz="sm" c="dimmed" span inline>
            {value.addr} {value.countryCode && (
                <CountryFlag countryCode={value.countryCode} />
            )}
        </Text>
    );
};

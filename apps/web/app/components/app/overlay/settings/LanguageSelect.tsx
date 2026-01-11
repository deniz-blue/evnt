import type { LanguageKey } from "@evnt/schema";
import { OsuSelect } from "../../../base/input/OsuSelect";

export const LanguageSelect = ({
    value,
    onChange,
}: {
    value: LanguageKey;
    onChange: (value: LanguageKey) => void;
}) => {
    return (
        <OsuSelect
            value={value}
            onChange={onChange}
        />
    );
};

import type { Translations } from "@evnt/format";

export const Trans = ({
    t,
}: {
    t?: Translations | null;
}) => {
    return (
        <>
            {t?.["en"] ?? ""}
        </>
    );
};

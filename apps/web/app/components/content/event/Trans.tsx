import type { Translations } from "@evnt/schema";

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

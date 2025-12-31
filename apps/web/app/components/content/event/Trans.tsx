import type { Translations } from "@repo/model";

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

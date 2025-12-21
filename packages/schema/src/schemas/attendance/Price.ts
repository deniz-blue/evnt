import z from "zod";

export type Price = z.infer<typeof PriceSchema>;
export const PriceSchema = z.object({
    id: z.string().optional(),
    amount: z.number(),
    currency: z.string().optional().meta({ description: "ISO 4217, required if amount is present" }),
}).refine(data => (data.amount ? data.currency !== undefined : true), {
    message: "Currency is required if amount is present",
}).meta({
    id: "Price",
});

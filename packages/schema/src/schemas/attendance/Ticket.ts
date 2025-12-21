import z from "zod";
import { PriceSchema } from "./Price";

// Semantics: Can a ticket have multiple prices (e.g. early bird, regular, late)?
// Should we say that those are different tickets instead?
// Upstream will have TicketSchema.array() anyway

// This also does not really cover:
// - availability (e.g. sold out, limited availability, available)
// - validity period (e.g. valid from, valid until)
// - pay what you want / donation tickets / name your price

export type Ticket = z.infer<typeof TicketSchema>;
export const TicketSchema = z.object({
    id: z.string().optional(),
    name: z.string().meta({ description: "A label for the ticket" }),
    price: PriceSchema.optional().meta({ description: "The price of the ticket" }),
}).meta({
    id: "Ticket",
});


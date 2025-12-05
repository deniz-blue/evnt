import z from "zod";
import { VenueTypeSchema } from "./VenueType";
import { BaseVenueSchema } from "./BaseVenue";

export type Address = z.infer<typeof AddressSchema>;
export const AddressSchema = z.object({
    countryCode: z.string().optional(),
    postalCode: z.string().optional(),
    addr: z.string().optional(),
})

export type LatLng = z.infer<typeof LatLngSchema>;
export const LatLngSchema = z.object({
    lat: z.number(),
    lng: z.number(),
})

export type PhysicalVenue = z.infer<typeof PhysicalVenueSchema>;
export const PhysicalVenueSchema = BaseVenueSchema.extend({
    venueType: z.literal(VenueTypeSchema.enum.physical),
    address: AddressSchema.optional(),
    coordinates: LatLngSchema.optional(),
    googleMapsPlaceId: z.string().optional(),
})

import { $ZodArray, $ZodBoolean, $ZodDefault, $ZodDiscriminatedUnion, $ZodEnum, $ZodLiteral, $ZodNullable, $ZodNumber, $ZodObject, $ZodOptional, $ZodString, type $ZodType, type $ZodTypes } from "zod/v4/core";

export const createDefaultValue = (schema: $ZodTypes): any => {
    // unwrap effects, optional, default, nullable
    // while (
    //     schema instanceof $ZodOptional ||
    //     schema instanceof $ZodNullable ||
    //     schema instanceof $ZodDefault
    // ) {
    //     if (schema instanceof $ZodDefault) {
    //         return schema._zod.def.defaultValue;
    //     }
    //     schema = schema._zod.def.innerType as $ZodTypes;
    // }

    if (schema instanceof $ZodOptional) return undefined;
    if (schema instanceof $ZodNullable) return null;
    if (schema instanceof $ZodDefault) return schema._zod.def.defaultValue;
    if (schema instanceof $ZodLiteral) return schema._zod.def.values[0];
    if (schema instanceof $ZodString) return "";
    if (schema instanceof $ZodNumber) return 0;
    if (schema instanceof $ZodBoolean) return false;
    if (schema instanceof $ZodEnum) return schema._zod.def.entries[0];
    if (schema instanceof $ZodArray) return [];
    if (schema instanceof $ZodObject) {
        const shape = schema._zod.def.shape;
        return Object.fromEntries(
            Object.entries(shape).map(([key, value]) => [
                key,
                createDefaultValue(value as $ZodTypes),
            ])
        );
    }
    if (schema instanceof $ZodDiscriminatedUnion) {
        const firstOption = schema._zod.def.options[0];
        const value = createDefaultValue(firstOption as $ZodTypes);
        return value;
    }

    return null;
};

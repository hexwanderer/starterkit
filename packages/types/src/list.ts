import { z } from "zod";

const direction = ["asc", "desc"] as const;
export type Direction = (typeof direction)[number];

export function listSchema<ItemType extends z.ZodTypeAny>(
  itemSchema: ItemType,
  sortFields: string[],
) {
  return z.object({
    filter: itemSchema,
    sort: z
      .object({
        field: z.enum(["createdAt", "updatedAt"]).nullable(),
        direction: z.enum(direction).nullable(),
      })
      .nullable(),
  });
}

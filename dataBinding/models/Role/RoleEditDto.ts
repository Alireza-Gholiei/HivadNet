import { z } from "zod";

export const RoleEditSchema = z.object({
    Id: z.number(),
    Name: z.string().min(2, "نام نقش باید حداقل ۲ کاراکتر باشد"),
    AccessAll: z.boolean(),
    ParentId: z.number().optional(),
    Forms: z.array(z.number()),
});

export type RoleEditDto = z.infer<typeof RoleEditSchema>;

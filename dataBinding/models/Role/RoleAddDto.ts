import { z } from "zod";

export const RoleAddSchema = z.object({
	Name: z.string().min(2, "نام نقش باید حداقل ۲ کاراکتر باشد"),
	AccessAll: z.boolean(),
	ParentId: z.number().optional(),
	Forms: z.array(z.number()),
});

export type RoleAddDto = z.infer<typeof RoleAddSchema>;

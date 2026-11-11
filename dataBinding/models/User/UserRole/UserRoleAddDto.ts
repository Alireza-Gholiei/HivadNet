import z from "zod";

export const UserRoleAddSchema = z.object({
	RoleId: z.number().min(1, "لطفاً یک نقش را انتخاب کنید"),
	UserId: z.number().min(1, "لطفاً یک کاربر را انتخاب کنید"),
});

export type UserRoleAddDto = z.infer<typeof UserRoleAddSchema>;

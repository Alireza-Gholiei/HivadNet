import { z } from "zod";

export const ChatCreateGroupSchema = z.object({
	Name: z.string().min(2, "نام گروه الزامی است"),
	UserIds: z.array(z.number()).min(1, "حداقل یک کاربر را انتخاب کنید"),
});

export type ChatCreateGroupDto = z.infer<typeof ChatCreateGroupSchema>;

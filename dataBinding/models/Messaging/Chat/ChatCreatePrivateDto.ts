import { z } from "zod";

export const ChatCreatePrivateSchema = z.object({
	TargetUserId: z.number("انتخاب کاربر الزامی است").min(1, "انتخاب کاربر الزامی است"),
});

export type ChatCreatePrivateDto = z.infer<typeof ChatCreatePrivateSchema>;

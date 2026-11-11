import z from "zod";

export const ChatAddSchema = z.object({
	Name: z.string("لطفا عنوان پیام را وارد کنید").nonempty("لطفا عنوان پیام را وارد کنید"),
	ChatMessage: z.string("لطفا پیام را وارد کنید").nonempty("لطفا پیام را وارد کنید"),
});

export type ChatAddDto = z.infer<typeof ChatAddSchema>;

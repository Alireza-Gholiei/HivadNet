import z from "zod";

export const UserChangePasswordSchema = z
	.object({
		UserId: z.number("کاربر را انتخاب کنید"),
		Password: z.string().min(6, "رمز عبور جدید باید حداقل ۶ کاراکتر باشد"),
		PasswordConfirmation: z.string().min(1, "تکرار رمز عبور جدید الزامی است"),
	})
	.refine((data) => data.Password === data.PasswordConfirmation, {
		message: "رمز عبور جدید و تکرار آن مطابقت ندارند",
		path: ["PasswordConfirmation"],
	});

export type UserChangePasswordDto = z.infer<typeof UserChangePasswordSchema>;

import z from "zod";

export const UserAddSchema = z
	.object({
		RoleId: z.number().min(1, "لطفاً یک نقش را انتخاب کنید"),
		UserName: z
			.string()
			.min(11, "نام کاربری باید حداقل 11 کاراکتر باشد")
			.max(11, "نام کاربری باید حداکثر 11 کاراکتر باشد"),
		FirstName: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد"),
		LastName: z.string().min(2, "نام خانوادگی باید حداقل ۲ کاراکتر باشد"),
		Password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
		PasswordConfirmation: z.string().min(1, "تکرار رمز عبور الزامی است"),
	})
	.refine((data) => data.Password === data.PasswordConfirmation, {
		message: "رمز عبور و تکرار آن مطابقت ندارند",
		path: ["PasswordConfirmation"],
	});

export type UserAddDto = z.infer<typeof UserAddSchema>;

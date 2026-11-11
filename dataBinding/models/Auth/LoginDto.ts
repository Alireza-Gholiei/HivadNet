import z from "zod";

export const LoginSchema = z.object({
	PhoneNumber: z
		.string("شماره تماس الزامی است")
		.min(11, "شماره تماس باید 11 رقم باشد")
		.max(11, "شماره تماس باید 11 رقم باشد")
		.regex(/^[0-9]+$/, "فقط عدد مجاز است")
		.refine((v) => v.startsWith("09"), {
			message: "شماره تماس باید با 09 شروع شود",
		}),
	Password: z.string("رمزعبور الزامی است").min(6, "رمزعبور حداقل 6 رقم باشد"),
});

export type LoginDto = z.infer<typeof LoginSchema>;

import z from "zod";

export const CustomerAddSchema = z.object({
	FirstName: z.string("نام الزامی است").nonempty("نام الزامی است"),
	LastName: z.string("نام خانوادگی الزامی است").nonempty("نام خانوادگی الزامی است"),
	PhoneNumber: z
		.string("شماره تماس الزامی است")
		.min(11, "شماره تماس باید 11 رقم باشد")
		.max(11, "شماره تماس باید 11 رقم باشد")
		.regex(/^[0-9]+$/, "فقط عدد مجاز است")
		.refine((v) => v.startsWith("09"), {
			message: "شماره تماس باید با 09 شروع شود",
		}),
	NationalCode: z
		.string("کدملی الزامی است")
		.min(10, "کدملی باید 10 رقم باشد")
		.max(10, "کدملی باید 10 رقم باشد")
		.regex(/^[0-9]+$/, "فقط عدد مجاز است"),
	Job: z.string().nullable(),
	Address: z.string().nullable(),
	Type: z.number("نوع مشتری الزامی است"),
});

export type CustomerAddDto = z.infer<typeof CustomerAddSchema>;

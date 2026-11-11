import z from "zod";

export const CustomerAddCardSchema = z.object({
	CustomerId: z.number(),

	CardNumber: z
		.string("شماره کارت الزامی است")
		.length(16, "شماره کارت باید 16 رقم باشد")
		.regex(/^\d+$/, "فقط عدد مجاز است"),

	AccountNumber: z.string().nullable().optional(),

	ShebaNumber: z
		.string()
		.nullable()
		.optional()
		.refine((v) => !v || /^IR\d{24}$/.test(v), "شماره شبا باید با IR شروع شود و 26 کاراکتر باشد"),

	OwnerName: z.string().nullable().optional(),

	ExpireMonth: z.string("ماه انقضا الزامی است").regex(/^(0[1-9]|1[0-2])$/, "ماه انقضا نامعتبر است"),

	ExpireYear: z.string("سال انقضا الزامی است").regex(/^\d{2}$/, "سال انقضا نامعتبر است"),

	Cvv2: z.string("CVV2 الزامی است").regex(/^\d{3,4}$/, "CVV2 باید 3 یا 4 رقم باشد"),
});

export type CustomerAddCardDto = z.infer<typeof CustomerAddCardSchema>;

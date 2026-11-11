import z from "zod";

export enum CustomerEntryType {
	Debit = 1,
	Credit = 2,
}

export const CustomerEntrySchema = z
	.object({
		CustomerId: z.number().min(1, "مشتری نامعتبر است"),
		EntryDate: z.date({ message: "تاریخ سند الزامی است" }),
		Description: z.string().min(1, "شرح سند الزامی است").max(500, "شرح سند نمی‌تواند بیشتر از 500 کاراکتر باشد"),
		Type: z.number().min(1, "نوع تراکنش نامعتبر است").max(2, "نوع تراکنش نامعتبر است"),
		Amount: z.number().min(1, "مبلغ باید بیشتر از صفر باشد"),
		PaymentMethod: z.number().nullable(),
	})
	.superRefine((data, ctx) => {
		if (data.Type === CustomerEntryType.Credit && !data.PaymentMethod) {
			ctx.addIssue({
				code: "custom",
				path: ["PaymentMethod"],
				message: "روش پرداخت برای تراکنش بستانکار الزامی است",
			});
		}
	});

export type CustomerEntryDto = z.infer<typeof CustomerEntrySchema>;

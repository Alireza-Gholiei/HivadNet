import z from "zod";

export const JournalEntryLineSchema = z
	.object({
		AccountId: z.number().min(1, "حساب آرتیکل نامعتبر است"),
		Debit: z.number().min(0),
		Credit: z.number().min(0),
		Description: z.string().nullable().optional(),
		ReferenceType: z.number(),
		CostCenterId: z.number().nullable().optional(),
		ProjectId: z.number().nullable().optional(),
		PaymentMethod: z.number().nullable().optional(),
	})
	.superRefine((data, ctx) => {
		const isDebit = data.Debit > 0 && data.Credit === 0;
		const isCredit = data.Credit > 0 && data.Debit === 0;

		if (!isDebit && !isCredit) {
			ctx.addIssue({
				code: "custom",
				path: ["Debit"],
				message: "هر آرتیکل باید فقط بدهکار یا بستانکار باشد",
			});
		}
	});

export const JournalEntryAddManualSchema = z
	.object({
		CustomerId: z.number().min(1, "مشتری نامعتبر است"),
		EntryDate: z.date({ message: "تاریخ سند الزامی است" }),
		Description: z.string().min(1, "شرح سند الزامی است").max(500, "شرح سند نمی‌تواند بیشتر از 500 کاراکتر باشد"),
		Lines: z.array(JournalEntryLineSchema).min(2, "سند باید حداقل دو آرتیکل داشته باشد"),
	})
	.superRefine((data, ctx) => {
		const totalDebit = data.Lines.reduce((sum, item) => sum + item.Debit, 0);
		const totalCredit = data.Lines.reduce((sum, item) => sum + item.Credit, 0);

		if (totalDebit !== totalCredit) {
			ctx.addIssue({
				code: "custom",
				path: ["Lines"],
				message: "جمع بدهکار و بستانکار باید برابر باشد",
			});
		}
	});

export type JournalEntryLineDto = z.infer<typeof JournalEntryLineSchema>;
export type JournalEntryAddManualDto = z.infer<typeof JournalEntryAddManualSchema>;

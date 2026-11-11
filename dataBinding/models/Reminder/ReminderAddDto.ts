import z from "zod";

export const ReminderAddDtoSchema = z
	.object({
		Title: z.string().min(1, "وارد کردن عنوان الزامی است").max(200, "عنوان نمی‌تواند بیشتر از ۲۰۰ کاراکتر باشد"),
		Description: z
			.string()
			.min(1, "وارد کردن توضیحات الزامی است")
			.max(1000, "توضیحات نمی‌تواند بیشتر از ۱۰۰۰ کاراکتر باشد"),
		Type: z.number("انتخاب نوع یادآوری الزامی است"),
		EndDate: z.date().nullable().optional(),
		EndTime: z.string().nullable().optional(),
	})
	.superRefine((data, ctx) => {
		if (data.Type === 1) {
			if (!data.EndTime || data.EndTime.trim() === "") {
				ctx.addIssue({
					code: "custom",
					path: ["EndTime"],
					message: "برای این نوع یادآوری، وارد کردن زمان الزامی است.",
				});
			}
		}

		if (data.Type === 2) {
			if (!data.EndDate) {
				ctx.addIssue({
					code: "custom",
					path: ["EndDate"],
					message: "برای این نوع یادآوری، انتخاب تاریخ الزامی است.",
				});
			}

			if (!data.EndTime || data.EndTime.trim() === "") {
				ctx.addIssue({
					code: "custom",
					path: ["EndTime"],
					message: "برای این نوع یادآوری، وارد کردن زمان الزامی است.",
				});
			}

			if (data.EndDate) {
				const today = new Date();
				today.setHours(0, 0, 0, 0);

				const selectedDate = new Date(data.EndDate);
				selectedDate.setHours(0, 0, 0, 0);

				if (selectedDate < today) {
					ctx.addIssue({
						code: "custom",
						path: ["EndDate"],
						message: "تاریخ پایان باید بزرگتر یا مساوی امروز باشد.",
					});
				}
			}
		}
	});

export type ReminderAddDto = z.infer<typeof ReminderAddDtoSchema>;

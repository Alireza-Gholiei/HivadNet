import z from "zod";

export const GuildGroupAddFieldColumnSchema = z.object({
	Key: z.string("کلید فیلد الزامی است").nonempty("کلید فیلد الزامی است"),
	Title: z.string("نام فیلد الزامی است").nonempty("نام فیلد الزامی است"),
	DataType: z.number("نوع داده الزامی است"),
	IsRequired: z.boolean(),
});

export const GuildGroupAddReminderSchema = z.object({
	SmsTemplateId: z.number("قالب پیامک الزامی است"),
	Type: z.number("نوع یادآور الزامی است"),
	DayOfMonth: z.number().nullable(),
	TimeOfDay: z.string().nullable(),
});

export const GuildGroupAddFieldSchema = z
	.object({
		FieldName: z.string("نام فیلد الزامی است").nonempty("نام فیلد الزامی است"),
		DataType: z.number("نوع داده الزامی است"),
		IsRequired: z.boolean(),
		Columns: z.array(GuildGroupAddFieldColumnSchema).nullable(),
	})
	.superRefine((value, ctx) => {
		if (value.DataType === 5 && (!value.Columns || value.Columns.length === 0)) {
			ctx.addIssue({
				code: "custom",
				path: ["Columns"],
				message: "برای فیلد لیستی حداقل یک ستون تعریف کنید",
			});
		}
	});

export const GuildGroupAddSchema = z.object({
	GuildId: z.number("سامانه را انتخاب کنید"),
	Name: z.string("نام الزامی است").nonempty("نام الزامی است"),
	Fields: z.array(GuildGroupAddFieldSchema).nullable(),
	Reminder: GuildGroupAddReminderSchema.nullable(),
});

export type GuildGroupAddReminderDto = z.infer<typeof GuildGroupAddReminderSchema>;
export type GuildGroupAddFieldColumnDto = z.infer<typeof GuildGroupAddFieldColumnSchema>;
export type GuildGroupAddFieldsDto = z.infer<typeof GuildGroupAddFieldSchema>;
export type GuildGroupAddDto = z.infer<typeof GuildGroupAddSchema>;

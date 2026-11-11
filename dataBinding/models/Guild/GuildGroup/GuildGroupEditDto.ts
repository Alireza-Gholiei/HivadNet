import z from "zod";

export const GuildGroupEditFieldColumnSchema = z.object({
	Key: z.string("کلید فیلد الزامی است").nonempty("کلید فیلد الزامی است"),
	Title: z.string("نام فیلد الزامی است").nonempty("نام فیلد الزامی است"),
	DataType: z.number("نوع داده الزامی است"),
	IsRequired: z.boolean(),
});

export const GuildGroupEditReminderSchema = z.object({
	Id: z.number(),
	SmsTemplateId: z.number("قالب پیامک الزامی است"),
	Type: z.number("نوع یادآور الزامی است"),
	DayOfMonth: z.number().nullable(),
	TimeOfDay: z.string().nullable(),
});

export const GuildGroupEditFieldSchema = z
	.object({
		Id: z.number(),
		FieldName: z.string("نام فیلد الزامی است").nonempty("نام فیلد الزامی است"),
		DataType: z.number("نوع داده الزامی است"),
		IsRequired: z.boolean(),
		Columns: z.array(GuildGroupEditFieldColumnSchema).nullable(),
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

export const GuildGroupEditSchema = z.object({
	Id: z.number(),
	GuildId: z.number("سامانه را انتخاب کنید"),
	Name: z.string("نام الزامی است").nonempty("نام الزامی است"),
	IsActive: z.boolean(),
	Fields: z.array(GuildGroupEditFieldSchema).nullable(),
	Reminder: GuildGroupEditReminderSchema.nullable(),
});

export type GuildGroupEditReminderDto = z.infer<typeof GuildGroupEditReminderSchema>;
export type GuildGroupEditFieldColumnDto = z.infer<typeof GuildGroupEditFieldColumnSchema>;
export type GuildGroupEditFieldsDto = z.infer<typeof GuildGroupEditFieldSchema>;
export type GuildGroupEditDto = z.infer<typeof GuildGroupEditSchema>;

import z from "zod";

export const GuildAddFieldColumnSchema = z.object({
	Key: z.string("کلید فیلد الزامی است").nonempty("کلید فیلد الزامی است"),
	Title: z.string("نام فیلد الزامی است").nonempty("نام فیلد الزامی است"),
	DataType: z.number("نوع داده الزامی است"),
	IsRequired: z.boolean(),
});

export const GuildAddFieldSchema = z
	.object({
		FieldName: z.string("نام فیلد الزامی است").nonempty("نام فیلد الزامی است"),
		DataType: z.number("نوع داده الزامی است"),
		IsRequired: z.boolean(),
		Columns: z.array(GuildAddFieldColumnSchema).nullable(),
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

export const GuildAddSchema = z.object({
	Name: z.string("نام الزامی است").nonempty("نام الزامی است"),
	Description: z.string("توضیحات الزامی است").nonempty("توضیحات الزامی است"),
	Fields: z.array(GuildAddFieldSchema).nullable(),
});

export type GuildAddFieldColumnDto = z.infer<typeof GuildAddFieldColumnSchema>;
export type GuildAddFieldsDto = z.infer<typeof GuildAddFieldSchema>;
export type GuildAddDto = z.infer<typeof GuildAddSchema>;

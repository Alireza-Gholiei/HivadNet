import { z } from "zod";

export const GuildEditFieldColumnSchema = z.object({
	Key: z.string("کلید فیلد الزامی است").nonempty("کلید فیلد الزامی است"),
	Title: z.string("نام فیلد الزامی است").nonempty("نام فیلد الزامی است"),
	DataType: z.number("نوع داده الزامی است"),
	IsRequired: z.boolean(),
});

export const GuildEditFieldSchema = z
	.object({
		Id: z.number(),
		FieldName: z.string().min(1, { message: "نام فیلد الزامی است" }),
		DataType: z.number("نوع داده الزامی است"),
		IsRequired: z.boolean(),
		Columns: z.array(GuildEditFieldColumnSchema).nullable(),
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

export const GuildEditSchema = z.object({
	Id: z.number(),
	Name: z.string().min(1, { message: "نام سامانه الزامی است" }),
	Description: z.string(),
	Fields: z.array(GuildEditFieldSchema).nullable(),
});

export type GuildEditFieldColumnDto = z.infer<typeof GuildEditFieldColumnSchema>;
export type GuildEditFieldDto = z.infer<typeof GuildEditFieldSchema>;
export type GuildEditDto = z.infer<typeof GuildEditSchema>;

import { z } from "zod";

export const GuildGroupAddCustomerFieldsColumnSchema = z.object({
	Key: z.string("کلید فیلد الزامی است").nonempty("کلید فیلد الزامی است"),
	Title: z.string("نام فیلد الزامی است").nonempty("نام فیلد الزامی است"),
	DataType: z.number("نوع داده الزامی است"),
	IsRequired: z.boolean(),
});

export const GuildGroupAddCustomerFieldsSchema = z
	.object({
		FieldId: z.number(),
		FieldName: z.string(),
		DataType: z.number(),
		IsRequired: z.boolean(),
		Value: z.any(),
		Columns: z.array(GuildGroupAddCustomerFieldsColumnSchema).nullable(),
	})
	.superRefine((data, ctx) => {
		if (data.IsRequired) {
			if (data.Value === "" || data.Value === null || data.Value === undefined) {
				ctx.addIssue({
					code: "custom",
					message: "تکمیل این فیلد الزامی است",
					path: ["Value"],
				});
			}
		}
	});

export const GuildGroupAddCustomerSchema = z.object({
	CustomerId: z.number(),
	GuildGroupId: z.number().min(1, { message: "انتخاب گروه سامانه الزامی است" }),
	Field: z.array(GuildGroupAddCustomerFieldsSchema).nullable(),
});

export type GuildGroupAddCustomerFieldsColumnDto = z.infer<typeof GuildGroupAddCustomerFieldsColumnSchema>;
export type GuildGroupAddCustomerFieldsDto = z.infer<typeof GuildGroupAddCustomerFieldsSchema>;
export type GuildGroupAddCustomerDto = z.infer<typeof GuildGroupAddCustomerSchema>;

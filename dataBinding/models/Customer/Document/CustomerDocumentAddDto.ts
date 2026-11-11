import z from "zod";

export const CustomerDocumentAddSchema = z.object({
	CustomerId: z.number(),
	Title: z.string("عنوان الزامی است").nonempty("عنوان الزامی است").min(1, "عنوان الزامی است"),
	Description: z.string().nullable().optional(),
	File: z.custom<File>(
		(value) => {
			if (typeof File === "undefined") return true;
			return value instanceof File;
		},
		{
			message: "انتخاب فایل الزامی است",
		},
	),
});

export type CustomerDocumentAddDto = z.infer<typeof CustomerDocumentAddSchema>;

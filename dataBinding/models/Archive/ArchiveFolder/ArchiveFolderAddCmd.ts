import z from "zod";

export const ArchiveFolderAddSchema = z.object({
	Name: z
		.string("نام پوشه را وارد کنید")
		.nonempty("نام پوشه را وارد کنید")
		.max(255, "نام پوشه نمی‌تواند بیشتر از 255 کاراکتر باشد"),

	ParentFolderId: z.number().nullable().optional(),
});

export type ArchiveFolderAddCmd = z.infer<typeof ArchiveFolderAddSchema>;

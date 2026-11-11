import z from "zod";

export const ArchiveFolderRenameSchema = z.object({
	FolderId: z.number("شناسه پوشه نامعتبر است").gt(0, "شناسه پوشه نامعتبر است"),

	NewName: z
		.string("نام جدید را وارد کنید")
		.nonempty("نام جدید را وارد کنید")
		.max(255, "نام پوشه نمی‌تواند بیشتر از 255 کاراکتر باشد"),
});

export type ArchiveFolderRenameCmd = z.infer<typeof ArchiveFolderRenameSchema>;

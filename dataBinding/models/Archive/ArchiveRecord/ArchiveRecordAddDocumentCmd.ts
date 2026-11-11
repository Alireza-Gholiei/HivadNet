import z from "zod";

export const ArchiveRecordAddDocumentSchema = z.object({
	Title: z.string("عنوان سند را وارد کنید").nonempty("عنوان سند را وارد کنید").max(500, "عنوان طولانی است"),

	Content: z.string("محتوای سند نمی‌تواند خالی باشد").nonempty("محتوای سند نمی‌تواند خالی باشد"),

	FolderId: z.number().nullable(),
});

export type ArchiveRecordAddDocumentCmd = z.infer<typeof ArchiveRecordAddDocumentSchema>;

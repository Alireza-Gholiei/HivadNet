import { z } from "zod";

export const ArchiveDocumentUpdateContentSchema = z.object({
	RecordId: z.number("شناسه رکورد نامعتبر است").gt(0, "شناسه رکورد نامعتبر است"),

	NewContent: z.string("محتوای جدید نمی‌تواند خالی باشد").nonempty("محتوای جدید نمی‌تواند خالی باشد"),
});

export type ArchiveDocumentUpdateContentCmd = z.infer<typeof ArchiveDocumentUpdateContentSchema>;

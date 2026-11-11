import z from "zod";

export const ArchiveRecordRenameSchema = z.object({
	RecordId: z.number("شناسه رکورد نامعتبر است").gt(0, "شناسه رکورد نامعتبر است"),

	NewTitle: z.string("عنوان جدید الزامی است").nonempty("عنوان جدید الزامی است").max(255, "عنوان جدید الزامی است"),
});

export type ArchiveRecordRenameCmd = z.infer<typeof ArchiveRecordRenameSchema>;

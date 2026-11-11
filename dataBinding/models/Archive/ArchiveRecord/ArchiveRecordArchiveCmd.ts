import z from "zod";

export const ArchiveRecordArchiveSchema = z.object({
	RecordId: z.number("شناسه رکورد نامعتبر است").gt(0, "شناسه رکورد نامعتبر است"),
});

export type ArchiveRecordArchiveCmd = z.infer<typeof ArchiveRecordArchiveSchema>;

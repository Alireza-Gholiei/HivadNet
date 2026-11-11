import z from "zod";

export const ArchiveRecordMoveSchema = z.object({
	RecordId: z.number("شناسه رکورد نامعتبر است").gt(0, "شناسه رکورد نامعتبر است"),

	NewFolderId: z.number().nullable(),
});

export type ArchiveRecordMoveCmd = z.infer<typeof ArchiveRecordMoveSchema>;

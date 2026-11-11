import z from "zod";

export const ArchiveFolderMoveSchema = z.object({
	FolderId: z.number("شناسه پوشه نامعتبر است").gt(0, "شناسه پوشه نامعتبر است"),
	NewParentFolderId: z.number().nullable(),
});

export type ArchiveFolderMoveCmd = z.infer<typeof ArchiveFolderMoveSchema>;

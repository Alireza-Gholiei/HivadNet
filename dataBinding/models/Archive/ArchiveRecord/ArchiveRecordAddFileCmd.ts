import z from "zod";

export const ArchiveRecordAddFileSchema = z.object({
	Title: z
		.string("عنوان فایل را وارد کنید")
		.nonempty("عنوان فایل را وارد کنید")
		.min(1, "عنوان فایل را وارد کنید")
		.max(500, "عنوان طولانی است"),
	FolderId: z.number().nullable().optional(),
	File: z.custom<File>(
		(value) => {
			if (typeof File === "undefined") return true;
			return value instanceof File;
		},
		{
			message: "فایل الزامی است",
		},
	),
});

export type ArchiveRecordAddFileCmd = z.infer<typeof ArchiveRecordAddFileSchema>;

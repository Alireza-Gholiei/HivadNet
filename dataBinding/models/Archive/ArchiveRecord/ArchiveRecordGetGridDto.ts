export interface ArchiveRecordGetGridDto {
	Id: number;
	Title: string;
	RecordType: string;
	FolderName: string;
	IsArchived: boolean;
	CreatedAt: string;
	FileName: string | null;
}

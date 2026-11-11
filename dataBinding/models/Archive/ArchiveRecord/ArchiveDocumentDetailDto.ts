export interface ArchiveDocumentDetailDto {
	Id: number;
	RecordId: number;
	CurrentContent: string;
	LastModified: string;
	Versions: ArchiveDocumentVersionDto[];
}

export interface ArchiveDocumentVersionDto {
	Id: number;
	VersionNumber: number;
	Content: string;
	CreatedAt: string;
}

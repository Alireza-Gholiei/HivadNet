export interface ChatSendMessageDto {
	ChatId: number;
	MessageText?: string | null;
	ReplyToMessageId?: number | null;

	FileUrl?: string | null;
	FileName?: string | null;
	FileType?: string | null;
	FileSize?: number | null;
}

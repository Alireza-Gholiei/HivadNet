export interface ChatGetByIdDto {
	Id: number;
	Name: string;
	IsGroup: boolean;
	CurrentUserId: number;
	Messages: ChatMessageGetByIdDto[];
	Users?: ChatUserInChatDto[];
}

export interface ChatUserInChatDto {
	UserId: number;
	FullName: string;
}

export interface ChatMessageGetByIdDto {
	Id: number;
	ChatId: number;
	SenderId: number;
	SenderName: string;
	MessageText?: string | null;
	ReplyToMessageId?: number | null;
	FileUrl?: string | null;
	FileName?: string | null;
	FileType?: string | null;
	FileSize?: number | null;
	IsRead: boolean;
	CurrentUserId?: number;
	CreatedDate: string;
}

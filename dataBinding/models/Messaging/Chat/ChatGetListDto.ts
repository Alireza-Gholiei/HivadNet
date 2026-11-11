export interface ChatGetListDto {
	Id: number;
	Name: string;
	IsGroup: boolean;
	LastMessage?: string | null;
	LastMessageTime?: string | null;
	HasNewMessage: boolean;
	NewMessageCount: number;
}

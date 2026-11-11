import { ChatCreatePrivateDto } from "@/dataBinding/models/Messaging/Chat/ChatCreatePrivateDto";
import { ChatGetByIdDto } from "@/dataBinding/models/Messaging/Chat/ChatGetByIdDto";
import { ChatGetListDto } from "@/dataBinding/models/Messaging/Chat/ChatGetListDto";
import { http } from "@/utilities/services/http.service";
import { StaticsUrl } from "@/utilities/StaticsUrl";

export const ChatService = {
	baseUrl: `${StaticsUrl.DevUrl}v1/Chat/`,

	async CreatePrivate(data: ChatCreatePrivateDto): Promise<number> {
		return await http.post<ChatCreatePrivateDto, number>(`${this.baseUrl}Private`, data);
	},
	async GetChats(): Promise<ChatGetListDto[]> {
		return await http.get<ChatGetListDto[]>(`${this.baseUrl}Get/Chats`);
	},
	async GetChat(id: number): Promise<ChatGetByIdDto> {
		return await http.get<ChatGetByIdDto>(`${this.baseUrl}Get/${id}`);
	},
};

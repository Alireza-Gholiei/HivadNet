"use client";

import { MessagesSquare } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import HraderTitle from "@/components/Shared/HraderTitle";
import { ChatGetListDto } from "@/dataBinding/models/Messaging/Chat/ChatGetListDto";
import { ChatService } from "@/dataBinding/services/Messaging/Chat/ChatService";
import Popup from "@/utilities/components/popup";
import { Button } from "@/utilities/components/ui/button";
import { PageCard, PageCardContent } from "@/utilities/components/ui/card";

import ChatCreatePrivateForm from "./ChatCreatePrivatePopup";

export default function ChatListPage() {
	const router = useRouter();

	const [chats, setChats] = useState<ChatGetListDto[]>([]);
	const [showAddChat, setShowAddChat] = useState(false);

	useEffect(() => {
		void fetchChats();
	}, []);

	const fetchChats = async () => {
		const result = await ChatService.GetChats();
		setChats(result ?? []);
	};

	return (
		<PageCard>
			<HraderTitle
				title="مدیریت گفتگو ها"
				description="مشاهده و مدیریت گفتگوهای داخلی"
				icon={<MessagesSquare />}
			/>

			<PageCardContent>
				<div className="relative p-4">
					<Button onClick={() => setShowAddChat(true)}>+</Button>

					<div className="flex flex-col space-y-3 mt-2">
						{chats.length !== 0 ? (
							chats.map((chat) => (
								<Link
									key={chat.Id}
									href={`/Messaging/chats/chat?id=${chat.Id}`}
									className="flex items-center p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100"
								>
									<div className="relative">
										<div className="w-14 h-14 rounded-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-700 font-bold text-xl shadow">
											{chat.Name?.[0] ?? "?"}
										</div>

										{chat.HasNewMessage && chat.NewMessageCount > 0 && (
											<span
												className="absolute -top-1 -right-1 min-w-6 h-6 px-1 bg-green-500 text-white text-xs
                                        font-bold rounded-full flex items-center justify-center shadow animate-bounce"
											>
												{chat.NewMessageCount}
											</span>
										)}
									</div>

									<div className="flex-1 mx-4 min-w-0">
										<h3
											className={`font-bold truncate ${
												chat.HasNewMessage ? "text-gray-900" : "text-gray-700"
											}`}
										>
											{chat.Name}
										</h3>

										<p
											className={`text-sm truncate ${
												chat.HasNewMessage ? "text-gray-900 font-semibold" : "text-gray-500"
											}`}
										>
											{chat.LastMessage || "هنوز پیامی ارسال نشده"}
										</p>
									</div>

									<div className="text-xs text-gray-400 whitespace-nowrap">
										{chat.LastMessageTime}
									</div>
								</Link>
							))
						) : (
							<div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
								<div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center shadow-inner">
									<span className="text-4xl">💬</span>
								</div>

								<h3 className="mt-4 text-lg font-bold text-gray-700">گفتگویی وجود ندارد</h3>

								<p className="mt-1 text-sm text-gray-500">برای شروع گفتگو یک کاربر را انتخاب کنید.</p>

								<Button onClick={() => setShowAddChat(true)}>شروع گفتگوی جدید</Button>
							</div>
						)}
					</div>
				</div>
			</PageCardContent>

			<Popup onClose={() => setShowAddChat(false)} show={showAddChat} title="شروع گفتگوی جدید" fullScreen>
				<ChatCreatePrivateForm
					onClose={() => setShowAddChat(false)}
					onSuccess={(chatId: number) => {
						setShowAddChat(false);
						router.push(`/Messaging/chats/chat?id=${chatId}`);
					}}
				/>
			</Popup>
		</PageCard>
	);
}

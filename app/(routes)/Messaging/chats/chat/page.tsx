/* eslint-disable @next/next/no-img-element */
"use client";

import * as signalR from "@microsoft/signalr";
import { MessageCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

import HraderTitle from "@/components/Shared/HraderTitle";
import { ChatFileUploadResultDto } from "@/dataBinding/models/Messaging/Chat/ChatFileUploadResultDto";
import { ChatGetByIdDto, ChatMessageGetByIdDto } from "@/dataBinding/models/Messaging/Chat/ChatGetByIdDto";
import { FilesService } from "@/dataBinding/services/Documents/FilesService";
import { ChatService } from "@/dataBinding/services/Messaging/Chat/ChatService";
import { Button } from "@/utilities/components/ui/button";
import { PageCard } from "@/utilities/components/ui/card";
import { Messenger } from "@/utilities/Messenger";
import { TokenService } from "@/utilities/services/token.service";
import { StaticsUrl } from "@/utilities/StaticsUrl";

function ChatPageContent() {
	const searchParams = useSearchParams();
	const chatId = Number(searchParams.get("id"));

	const [messages, setMessages] = useState<ChatMessageGetByIdDto[]>([]);
	const [chat, setChat] = useState<ChatGetByIdDto>();
	const [newMessage, setNewMessage] = useState("");
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [sending, setSending] = useState(false);

	const inputRef = useRef<HTMLInputElement | null>(null);
	const connectionRef = useRef<signalR.HubConnection | null>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

	useEffect(() => {
		void fetchChat();
	}, []);

	useEffect(() => {
		if (connectionRef.current) return;

		const conn = new signalR.HubConnectionBuilder()
			.withUrl(`${StaticsUrl.DevUrl}ChatMessenger`, {
				accessTokenFactory: async () => (await TokenService.getValidAccessToken()) ?? "",
				transport: signalR.HttpTransportType.WebSockets,
			})
			.withAutomaticReconnect()
			.build();

		connectionRef.current = conn;

		connectionRef.current.on("ReceiveMessage", (msg: ChatMessageGetByIdDto) => {
			setMessages((prev) => {
				if (prev.some((x) => x.Id === msg.Id)) return prev;
				return [...prev, msg];
			});
		});

		connectionRef.current.on("MessagesRead", (data: { ChatId: number; UserId: number }) => {
			if (data.ChatId !== chatId) return;

			setMessages((prev) =>
				prev.map((msg) => {
					if (msg.SenderId === data.UserId) return msg;
					return {
						...msg,
						IsRead: true,
					};
				}),
			);
		});

		const start = async () => {
			try {
				if (!connectionRef.current) return;

				await connectionRef.current.start();
				await connectionRef.current.invoke("JoinChat", chatId);
			} catch (err) {
				console.error("SignalR connection error:", err);
				Messenger.errorMessage("خطا در اتصال به پیام‌رسان");
			}
		};

		void start();

		return () => {
			if (connectionRef.current) {
				connectionRef.current.off("ReceiveMessage");
				connectionRef.current.off("MessagesRead");
				connectionRef.current.stop().catch(console.error);
				connectionRef.current = null;
			}
		};
	}, [chatId]);

	useEffect(() => {
		scrollToBottom();

		if (messages.length > 0) {
			const currentUserId = chat?.CurrentUserId;

			const hasUnreadMessages = messages.some(
				(msg) => !msg.IsRead && msg.SenderId !== (currentUserId ?? msg.CurrentUserId),
			);

			if (hasUnreadMessages) {
				void readMessage();
			}
		}
	}, [messages, chat?.CurrentUserId]);

	const fetchChat = async () => {
		const result = await ChatService.GetChat(chatId);

		if (result) {
			setChat(result);
			setMessages(result.Messages ?? []);
		}
	};

	const readMessage = async () => {
		if (!connectionRef.current) return;

		try {
			await connectionRef.current.invoke("ReadMessage", chatId);
		} catch (err) {
			console.error("Error sending MessagesRead:", err);
		}
	};

	const validateFile = (file: File) => {
		const maxSize = 20 * 1024 * 1024;

		if (file.size > maxSize) {
			Messenger.errorMessage("حجم فایل نباید بیشتر از 20 مگابایت باشد");
			return false;
		}

		return true;
	};

	const onSelectFile = (file?: File) => {
		if (!file) return;

		if (!validateFile(file)) {
			if (fileInputRef.current) fileInputRef.current.value = "";
			return;
		}

		setSelectedFile(file);
	};

	const removeSelectedFile = () => {
		setSelectedFile(null);

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const sendMessage = async () => {
		if ((!newMessage.trim() && !selectedFile) || !connectionRef.current) return;

		try {
			setSending(true);

			let uploadedFile: ChatFileUploadResultDto | null = null;

			if (selectedFile) {
				uploadedFile = await FilesService.UploadForChat(selectedFile);
			}

			const dto = {
				ChatId: chatId,
				MessageText: newMessage.trim() || null,
				ReplyToMessageId: null,

				FileUrl: uploadedFile?.FileUrl ?? null,
				FileName: uploadedFile?.FileName ?? null,
				FileType: uploadedFile?.FileType ?? null,
				FileSize: uploadedFile?.FileSize ?? null,
			};

			const result = await connectionRef.current.invoke<boolean>("SendMessage", dto);

			if (result) {
				setNewMessage("");
				removeSelectedFile();
			} else {
				Messenger.errorMessage("ارسال پیام ناموفق بود");
			}
		} catch (err) {
			console.error("Send message error:", err);
			Messenger.errorMessage("خطا در ارسال پیام");
		} finally {
			setSending(false);
		}
	};

	useEffect(() => {
		if (!sending) {
			inputRef.current?.focus();
		}
	}, [sending]);

	const getFileUrl = (url?: string | null) => {
		if (!url) return "";
		if (url.startsWith("http")) return url;

		return `${StaticsUrl.FilsUrl}${url.startsWith("/") ? url.substring(1) : url}`;
	};

	const renderMessageFile = (msg: ChatMessageGetByIdDto, isMe: boolean) => {
		if (!msg.FileUrl) return null;

		const fileUrl = getFileUrl(msg.FileUrl);
		const fileType = msg.FileType ?? "";

		if (fileType.startsWith("image/")) {
			return (
				<a href={fileUrl} target="_blank" rel="noopener noreferrer">
					<img
						src={fileUrl}
						alt={msg.FileName ?? "image"}
						className="mt-2 w-80 rounded-xl border object-contain"
					/>
				</a>
			);
		}

		return (
			<a
				href={fileUrl}
				target="_blank"
				rel="noopener noreferrer"
				className={`mt-2 flex items-center gap-2 p-3 rounded-xl border ${
					isMe ? "bg-blue-500 border-blue-400 text-white" : "bg-gray-50 border-gray-200 text-gray-700"
				}`}
			>
				<span className="text-xl">📎</span>

				<div className="min-w-0">
					<p className="text-sm font-bold truncate max-w-45">{msg.FileName ?? "دانلود فایل"}</p>

					{msg.FileSize && <p className="text-xs opacity-70">{formatFileSize(msg.FileSize)}</p>}
				</div>
			</a>
		);
	};

	const formatFileSize = (size: number) => {
		if (size < 1024) return `${size} B`;
		if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
		return `${(size / 1024 / 1024).toFixed(1)} MB`;
	};

	return (
		<PageCard>
			<HraderTitle
				title={`صفحه گفتگو ${chat?.Name}`}
				description="مشاهده و ارسال پیام"
				icon={<MessageCircle />}
			/>
			<div className="p-4 h-[85vh]">
				<div className="flex h-full flex-col bg-gray-100 rounded-2xl border-2">
					<div className="shrink-0 flex items-center p-4 bg-white rounded-t-2xl">
						<div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-bold ml-3 shadow-md">
							{chat?.Name?.[0] ?? "?"}
						</div>

						<div>
							<h3 className="font-bold text-gray-800">{chat?.Name ?? "گفتگو"}</h3>
						</div>
					</div>

					<div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3">
						{messages.map((msg) => {
							const currentUserId = chat?.CurrentUserId ?? msg.CurrentUserId;
							const isMe = msg.SenderId === currentUserId;

							return (
								<div key={msg.Id} className={`flex ${isMe ? "justify-start" : "justify-end"}`}>
									<div
										className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm animate-fadeIn ${
											isMe
												? "bg-blue-600 text-white rounded-bl-2xl rounded-br-none"
												: "bg-white text-gray-800 rounded-br-2xl border border-gray-100 rounded-bl-none"
										}`}
									>
										{!isMe && msg.SenderName && (
											<p className="text-xs text-gray-500 mb-1">{msg.SenderName}</p>
										)}

										{msg.MessageText && (
											<p className="whitespace-pre-line leading-relaxed">{msg.MessageText}</p>
										)}

										{renderMessageFile(msg, isMe)}

										<div
											className={`text-[10px] mt-1 flex items-center justify-end gap-1 opacity-70 ${
												isMe ? "text-gray-100" : "text-gray-400"
											}`}
										>
											<span>{formatMessageTime(msg.CreatedDate)}</span>

											{isMe && <span>{msg.IsRead ? "✓✓" : "✓"}</span>}
										</div>
									</div>
								</div>
							);
						})}

						<div ref={messagesEndRef} />
					</div>

					{selectedFile && (
						<div className="shrink-0 px-3 py-2 bg-white border-t">
							<div className="flex-1 p-2 rounded-xl bg-gray-100 text-sm text-gray-700 truncate">
								📎 {selectedFile.name} - {formatFileSize(selectedFile.size)}
							</div>

							<Button
								type="button"
								size="icon"
								onClick={removeSelectedFile}
								className="w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold"
							>
								×
							</Button>
						</div>
					)}

					<div className="shrink-0 p-3 bg-white flex items-center rounded-b-2xl gap-2 ">
						<input
							ref={fileInputRef}
							type="file"
							hidden
							onChange={(e) => onSelectFile(e.target.files?.[0])}
						/>

						<Button
							type="button"
							size="icon"
							onClick={() => fileInputRef.current?.click()}
							className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-xl"
							disabled={sending}
						>
							📎
						</Button>

						<input
							ref={inputRef}
							type="text"
							value={newMessage}
							onChange={(e) => setNewMessage(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									void sendMessage();
								}
							}}
							placeholder="پیام خود را بنویسید..."
							className="flex-1 border border-gray-300 rounded-full px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
							disabled={sending}
						/>

						<Button
							onClick={() => void sendMessage()}
							disabled={sending || (!newMessage.trim() && !selectedFile)}
							className="bg-blue-600 disabled:bg-gray-300 text-white px-5 py-2 rounded-full font-bold hover:bg-blue-700 active:scale-95 transition shadow"
						>
							{sending ? "..." : "ارسال"}
						</Button>
					</div>
				</div>
			</div>
		</PageCard>
	);
}

function formatMessageTime(date: string) {
	if (!date) return "";

	const parsed = new Date(date);

	if (isNaN(parsed.getTime())) {
		return date;
	}

	return parsed.toLocaleTimeString("fa-IR", {
		hour: "2-digit",
		minute: "2-digit",
	});
}

export default function ChatPage() {
	return (
		<Suspense fallback={<div className="flex h-screen items-center justify-center">در حال بارگذاری...</div>}>
			<ChatPageContent />
		</Suspense>
	);
}

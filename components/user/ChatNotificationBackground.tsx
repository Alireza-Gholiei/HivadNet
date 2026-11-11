"use client";

import * as signalR from "@microsoft/signalr";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ChatMessageGetByIdDto } from "@/dataBinding/models/Messaging/Chat/ChatGetByIdDto";
import { Button } from "@/utilities/components/ui/button";
import { TokenService } from "@/utilities/services/token.service";
import { StaticsUrl } from "@/utilities/StaticsUrl";

type ReceiveMessageDto = ChatMessageGetByIdDto & {
	ChatId?: number;
	ChatName?: string | null;
	CurrentUserId?: number;
};

type ChatPopupNotification = {
	title: string;
	body: string;
	chatId?: number;
	senderName?: string | null;
	createdDate?: string | null;
};

const NOTIFIED_MESSAGES_STORAGE_KEY = "chat_notified_message_ids";
const MAX_NOTIFIED_MESSAGES = 300;

export default function ChatNotificationBackground() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();

	const connectionRef = useRef<signalR.HubConnection | null>(null);
	const notifiedMessageIdsRef = useRef<Set<number>>(new Set());
	const pathnameRef = useRef<string | null>(pathname);
	const currentChatIdRef = useRef<number>(Number(searchParams.get("id")) || 0);

	const [popupNotification, setPopupNotification] = useState<ChatPopupNotification | null>(null);

	useEffect(() => {
		pathnameRef.current = pathname;
		currentChatIdRef.current = Number(searchParams.get("id")) || 0;
	}, [pathname, searchParams]);

	useEffect(() => {
		loadNotifiedMessageIds();
		void registerChatServiceWorker();
	}, []);

	useEffect(() => {
		if (connectionRef.current) return;

		let disposed = false;

		const conn = new signalR.HubConnectionBuilder()
			.withUrl(`${StaticsUrl.DevUrl}ChatMessenger`, {
				accessTokenFactory: async () => (await TokenService.getValidAccessToken()) ?? "",
				transport: signalR.HttpTransportType.WebSockets,
				skipNegotiation: true,
			})
			.withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
			.build();

		connectionRef.current = conn;

		conn.on("ReceiveMessageNotification", handleIncomingMessage);

		conn.onreconnected(() => {
			void joinUser(conn);
		});

		const startConnection = async () => {
			try {
				await conn.start();

				if (disposed) return;

				await joinUser(conn);
			} catch (error) {
				console.error("Chat notification SignalR connection error:", error);
			}
		};

		void startConnection();

		return () => {
			disposed = true;
			conn.off("ReceiveMessageNotification", (msg) => {
				void handleIncomingMessage(msg);
			});
			conn.stop().catch(console.error);
			connectionRef.current = null;
		};
	}, []);

	const loadNotifiedMessageIds = () => {
		if (typeof window === "undefined") return;

		try {
			const raw = localStorage.getItem(NOTIFIED_MESSAGES_STORAGE_KEY);
			if (!raw) return;

			const ids = JSON.parse(raw) as number[];

			if (!Array.isArray(ids)) return;

			notifiedMessageIdsRef.current = new Set(
				ids
					.map(Number)
					.filter((id) => Number.isFinite(id) && id > 0)
					.slice(-MAX_NOTIFIED_MESSAGES),
			);
		} catch {
			localStorage.removeItem(NOTIFIED_MESSAGES_STORAGE_KEY);
		}
	};

	const saveNotifiedMessageIds = () => {
		if (typeof window === "undefined") return;

		const ids = Array.from(notifiedMessageIdsRef.current).slice(-MAX_NOTIFIED_MESSAGES);
		notifiedMessageIdsRef.current = new Set(ids);

		try {
			localStorage.setItem(NOTIFIED_MESSAGES_STORAGE_KEY, JSON.stringify(ids));
		} catch {}
	};

	const normalizeText = (value?: string | null) => {
		if (!value) return "";
		return value.replace(/\s+/g, " ").trim();
	};

	const hasRealText = (msg: ReceiveMessageDto) => {
		return normalizeText(msg.MessageText).length > 0;
	};

	const hasFile = (msg: ReceiveMessageDto) => {
		return Boolean(msg.FileName?.trim() || msg.FileUrl?.trim());
	};

	const getFileLabel = (msg: ReceiveMessageDto) => {
		const fileType = msg.FileType?.toLowerCase()?.trim() || "";
		const fileName = msg.FileName?.trim();

		if (fileType.startsWith("image/")) return fileName ? `تصویر: ${fileName}` : "یک تصویر جدید دریافت شد";
		if (fileType.startsWith("video/")) return fileName ? `ویدیو: ${fileName}` : "یک ویدیوی جدید دریافت شد";
		if (fileType.startsWith("audio/")) return fileName ? `فایل صوتی: ${fileName}` : "یک فایل صوتی جدید دریافت شد";
		if (fileType.includes("pdf")) return fileName ? `PDF: ${fileName}` : "یک فایل PDF جدید دریافت شد";

		return fileName ? `فایل جدید: ${fileName}` : "یک فایل جدید دریافت شد";
	};

	const handleIncomingMessage = async (msg: ReceiveMessageDto) => {
		if (!msg?.Id) return;

		const messageId = Number(msg.Id);

		if (!Number.isFinite(messageId) || messageId <= 0) return;
		if (notifiedMessageIdsRef.current.has(messageId)) return;
		if (!hasRealText(msg) && !hasFile(msg)) return;

		notifiedMessageIdsRef.current.add(messageId);
		saveNotifiedMessageIds();

		const currentPathname = pathnameRef.current;
		const currentChatId = currentChatIdRef.current;
		const messageChatId = Number(msg.ChatId) || 0;

		const isInChatPage = Boolean(currentPathname?.toLowerCase().includes("/chat"));
		const isSameOpenedChat =
			isInChatPage && messageChatId > 0 && currentChatId > 0 && messageChatId === currentChatId;

		if (isSameOpenedChat && !document.hidden) {
			return;
		}

		const title = buildNotificationTitle(msg);
		const body = buildNotificationBody(msg);

		if (!body) return;

		// if (document.hidden) {
		await showServiceWorkerNotification({
			title,
			body,
			chatId: messageChatId,
		});

		// 	return;
		// }

		setPopupNotification({
			title,
			body,
			chatId: messageChatId,
			senderName: msg.SenderName,
			createdDate: msg.CreatedDate,
		});
	};

	const buildNotificationTitle = (msg: ReceiveMessageDto) => {
		const senderName = msg.SenderName?.trim();
		const chatName = msg.ChatName?.trim();

		if (chatName && senderName) return `${chatName} - ${senderName}`;
		if (senderName) return `پیام جدید از ${senderName}`;
		if (chatName) return `پیام جدید در ${chatName}`;
		return "پیام جدید";
	};

	const buildNotificationBody = (msg: ReceiveMessageDto) => {
		const text = normalizeText(msg.MessageText);

		if (text) {
			const prefix = msg.ReplyToMessageId ? "پاسخ: " : "";
			const finalText = `${prefix}${text}`;
			return finalText.length > 120 ? `${finalText.slice(0, 120)}...` : finalText;
		}

		if (hasFile(msg)) {
			return getFileLabel(msg);
		}

		return "";
	};

	const openChat = (chatId?: number) => {
		setPopupNotification(null);

		if (chatId && chatId > 0) {
			router.push(`/Messaging/chats/chat?id=${chatId}`);
		}
	};

	const closePopup = () => {
		setPopupNotification(null);
	};

	const showServiceWorkerNotification = async ({
		title,
		body,
		chatId,
	}: {
		title: string;
		body: string;
		chatId?: number;
	}) => {
		if (typeof window === "undefined") return;
		if (!("serviceWorker" in navigator)) return;
		if (!("Notification" in window)) return;
		if (Notification.permission !== "granted") return;
		if (!body.trim()) return;

		try {
			const registration = await navigator.serviceWorker.ready;

			await registration.showNotification(title, {
				body,
				icon: "/icons/chat-notification.png",
				badge: "/icons/chat-notification.png",
				tag: chatId && chatId > 0 ? `chat-${chatId}` : "chat-message",
				requireInteraction: false,
				silent: false,
				data: {
					url: chatId && chatId > 0 ? `/chat?id=${chatId}` : "/chat",
					chatId,
				},
			});
		} catch (error) {
			console.error("Chat service worker notification error:", error);
		}
	};

	return (
		<>
			<ChatMessagePopup notification={popupNotification} onClose={closePopup} onOpenChat={openChat} />
		</>
	);
}

function ChatMessagePopup({
	notification,
	onClose,
	onOpenChat,
}: {
	notification: ChatPopupNotification | null;
	onClose: () => void;
	onOpenChat: (chatId?: number) => void;
}) {
	if (!notification) return null;

	return (
		<div className="fixed inset-0 z-9999 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
			<div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
				<div className="border-b border-slate-100 px-5 py-4">
					<div className="flex items-start justify-between gap-4">
						<div>
							<p className="text-xs font-medium text-slate-500">پیام جدید</p>
							<h3 className="mt-1 text-base font-bold text-slate-900">{notification.title}</h3>
						</div>

						<Button
							type="button"
							onClick={onClose}
							className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
							aria-label="بستن"
						>
							×
						</Button>
					</div>
				</div>

				<div className="px-5 py-4">
					<p className="whitespace-pre-line text-sm leading-7 text-slate-700">{notification.body}</p>

					{notification.createdDate && (
						<p className="mt-3 text-xs text-slate-400">{notification.createdDate}</p>
					)}
				</div>

				<div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4">
					<Button
						type="button"
						onClick={onClose}
						className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
					>
						بعداً
					</Button>

					<Button
						type="button"
						onClick={() => onOpenChat(notification.chatId)}
						className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
					>
						مشاهده پیام
					</Button>
				</div>
			</div>
		</div>
	);
}

async function joinUser(conn: signalR.HubConnection) {
	if (conn.state !== signalR.HubConnectionState.Connected) return;

	try {
		await conn.invoke("JoinUser");
	} catch (error) {
		console.error("JoinUser error:", error);
	}
}

async function registerChatServiceWorker() {
	if (typeof window === "undefined") return;
	if (!("serviceWorker" in navigator)) return;

	try {
		await navigator.serviceWorker.register("/chat-sw.js");
	} catch (error) {
		console.error("Chat service worker registration error:", error);
	}
}

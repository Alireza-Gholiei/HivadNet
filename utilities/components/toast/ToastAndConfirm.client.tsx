"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { registerToast } from "./toast.api";

type ToastMessage = string | React.ReactNode;

interface Toast {
	id: string;
	message: ToastMessage;
	type?: "success" | "error" | "info";
}

interface ConfirmOptions {
	message: ToastMessage;
	onConfirm: () => void;
	onCancel?: () => void;
	ConfirmBtText: string;
	CancelBtText?: string;
}

export default function ToastAndConfirmClient() {
	const [mounted, setMounted] = useState(false);
	const [toasts, setToasts] = useState<Toast[]>([]);
	const [confirm, setConfirm] = useState<ConfirmOptions | null>(null);

	useEffect(() => {
		setMounted(true);

		registerToast((message, type) => {
			const id = crypto.randomUUID();
			setToasts((t) => [...t, { id, message, type }]);
			setTimeout(() => {
				setToasts((t) => t.filter((x) => x.id !== id));
			}, 3000);
		});

		// registerConfirm((opt) => setConfirm(opt));
	}, []);

	if (!mounted) return null;

	return createPortal(
		<>
			<div className="fixed bottom-6 left-0 right-0 z-9999 flex flex-col items-center gap-2">
				<AnimatePresence>
					{toasts.map((t) => (
						<motion.div
							key={t.id}
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 50 }}
							transition={{ duration: 0.3 }}
							className={`px-5 py-3 rounded-2xl shadow-lg text-white text-sm backdrop-blur-md ${
								t.type === "success"
									? "bg-green-500/80"
									: t.type === "error"
									? "bg-red-500/80"
									: "bg-gray-800/80"
							}`}
						>
							{t.message}
						</motion.div>
					))}
				</AnimatePresence>
			</div>

			<AnimatePresence>
				{confirm && (
					<motion.div
						className="fixed inset-0 z-99999 flex items-center justify-center bg-black/40 backdrop-blur-sm"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							transition={{ type: "spring", duration: 0.3 }}
							className="w-72 bg-white rounded-2xl shadow-xl p-5"
						>
							<div className="text-center text-gray-800 text-base mb-5">{confirm.message}</div>
							<div className="flex justify-center gap-3">
								<button
									className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700 text-sm"
									onClick={() => {
										confirm.onCancel?.();
										setConfirm(null);
									}}
								>
									{confirm.CancelBtText}
								</button>
								<button
									className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm"
									onClick={() => {
										confirm.onConfirm();
										setConfirm(null);
									}}
								>
									{confirm.ConfirmBtText}
								</button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>,
		document.body
	);
}

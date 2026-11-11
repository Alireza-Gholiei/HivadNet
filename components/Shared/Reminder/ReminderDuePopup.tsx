"use client";

import { Bell, CheckCircle, X } from "lucide-react";

import { Button } from "@/utilities/components/ui/button";

interface ReminderDto {
	Id: number;
	Title: string;
	Description?: string | null;
	EndDate?: string | null;
	EndTime?: string | null;
}

interface ReminderDuePopupProps {
	reminder: ReminderDto | null;
	onClose: () => void;
	onComplete?: (id: number) => Promise<void> | void;
	isCompleting?: boolean;
}

export default function ReminderDuePopup({
	reminder,
	onClose,
	onComplete,
	isCompleting = false,
}: ReminderDuePopupProps) {
	if (!reminder) return null;

	const handleComplete = async () => {
		if (!onComplete) return;

		await onComplete(reminder.Id);
		onClose();
	};

	return (
		<div className="fixed inset-0 z-9999 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
			<div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
				<div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
					<div className="flex items-center gap-2">
						<div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-600">
							<Bell size={20} />
						</div>

						<div>
							<h3 className="text-sm font-bold text-slate-800">زمان یادآور فرا رسید</h3>
							<p className="text-xs text-slate-400">یک یادآور فعال شده است</p>
						</div>
					</div>

					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={onClose}
						className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
					>
						<X size={18} />
					</Button>
				</div>

				<div className="px-5 py-5">
					<h4 className="text-base font-bold text-slate-800">{reminder.Title}</h4>

					{reminder.Description && (
						<p className="mt-2 text-sm leading-6 text-slate-500">{reminder.Description}</p>
					)}

					<div className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-700">
						این یادآور به زمان تعیین‌شده رسیده است.
					</div>
				</div>

				<div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-4">
					<Button
						type="button"
						onClick={onClose}
						className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
					>
						بعداً
					</Button>

					{onComplete && (
						<Button
							type="button"
							disabled={isCompleting}
							onClick={() => void handleComplete()}
							className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
						>
							<CheckCircle size={17} />
							{isCompleting ? "در حال تکمیل..." : "تکمیل شد"}
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}

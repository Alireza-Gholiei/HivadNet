import { AlertTriangle, Inbox, LoaderCircle, Plus } from "lucide-react";

import { ReminderGetByUserDto } from "@/dataBinding/models/Reminder/ReminderGetByUserDto";
import { Button } from "@/utilities/components/ui/button";

import ReminderList from "./ReminderList";

interface ReminderListViewProps {
	reminders: ReminderGetByUserDto[];
	isLoading: boolean;
	error: string | null;
	completingId: number | null;
	onGoToAdd: () => void;
	onCompleteReminder: (id: number) => Promise<void>;
}

export default function ReminderListView({
	reminders,
	isLoading,
	error,
	completingId,
	onGoToAdd,
	onCompleteReminder,
}: ReminderListViewProps) {
	return (
		<div className="p-4">
			<Button
				type="button"
				variant="outline"
				onClick={onGoToAdd}
				className="w-full flex justify-center items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 px-4 py-2.5 rounded-lg hover:bg-indigo-100 transition-all font-bold shadow-sm mb-4"
			>
				<Plus size={20} />
				افزودن یادآور جدید
			</Button>

			{isLoading ? (
				<div className="min-h-[20vh] flex flex-col items-center justify-center text-slate-500">
					<LoaderCircle className="h-8 w-8 animate-spin text-indigo-600 mb-3" />
					<p className="font-medium">در حال بارگذاری لیست...</p>
				</div>
			) : error ? (
				<div className="min-h-[20vh] flex flex-col items-center justify-center text-rose-600">
					<AlertTriangle size={32} />
					<p className="mt-2 text-sm font-semibold">{error}</p>
				</div>
			) : reminders.length === 0 ? (
				<div className="min-h-[20vh] flex flex-col items-center justify-center text-center py-8 text-slate-500">
					<Inbox className="w-16 h-16 text-slate-300 mx-auto mb-4" />
					<h3 className="text-lg font-bold text-slate-700 mb-1">لیست خالی است</h3>
					<p className="text-sm">هیچ یادآوری برای نمایش وجود ندارد.</p>
				</div>
			) : (
				<ReminderList
					reminders={reminders}
					completingId={completingId}
					onCompleteReminder={onCompleteReminder}
				/>
			)}
		</div>
	);
}

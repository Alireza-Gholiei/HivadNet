import { CalendarClock, Check, LoaderCircle } from "lucide-react";

import { ReminderGetByUserDto } from "@/dataBinding/models/Reminder/ReminderGetByUserDto";
import { Button } from "@/utilities/components/ui/button";

interface ReminderItemProps {
	reminder: ReminderGetByUserDto;
	isCompleted: boolean;
	isCompleting: boolean;
	onCompleteReminder: (id: number) => Promise<void>;
}

export default function ReminderItem({ reminder, isCompleted, isCompleting, onCompleteReminder }: ReminderItemProps) {
	const formattedDate = reminder.EndDate ? new Date(reminder.EndDate).toLocaleString("fa-IR") : "---";

	if (isCompleted) {
		return (
			<li className="flex items-start p-3 bg-slate-50 border border-slate-200/50 rounded-lg opacity-70">
				<div className="shrink-0 mt-1.5 ml-3 w-2.5 h-2.5 rounded-full bg-emerald-400" />

				<div className="grow">
					<div className="flex justify-between items-center">
						<p className="font-bold text-slate-600 line-through">{reminder.Title}</p>

						<span className="text-xs px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full font-medium mr-2">
							{reminder.TypeName}
						</span>
					</div>

					{reminder.Description && <p className="text-sm text-slate-500 mt-1">{reminder.Description}</p>}

					<div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
						<CalendarClock size={14} />
						<span>{formattedDate}</span>
					</div>
				</div>
			</li>
		);
	}

	return (
		<li className="flex items-start p-3 bg-white border border-slate-200/80 rounded-lg shadow-sm hover:shadow-md hover:border-indigo-200 transition-all">
			<div className="shrink-0 mt-1.5 ml-3 w-2.5 h-2.5 rounded-full bg-indigo-500" />

			<div className="grow">
				<div className="flex justify-between items-center">
					<p className="font-bold text-slate-800">{reminder.Title}</p>

					<span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full font-medium mr-2">
						{reminder.TypeName}
					</span>
				</div>

				{reminder.Description && <p className="text-sm text-slate-600 mt-1">{reminder.Description}</p>}

				<div className="flex justify-between items-end mt-2">
					<div className="flex items-center gap-1.5 text-xs text-slate-500">
						<CalendarClock size={14} />
						<span>{formattedDate}</span>
					</div>

					<Button
						type="button"
						onClick={() => void onCompleteReminder(reminder.Id)}
						disabled={isCompleting}
						className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600"
						title="تکمیل یادآور"
					>
						{isCompleting ? <LoaderCircle className="animate-spin" size={14} /> : <Check size={14} />}
						انجام شد؟
					</Button>
				</div>
			</div>
		</li>
	);
}

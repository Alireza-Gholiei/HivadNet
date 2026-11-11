import { CheckCircle2 } from "lucide-react";

import { ReminderGetByUserDto } from "@/dataBinding/models/Reminder/ReminderGetByUserDto";

import ReminderItem from "./ReminderItem";

interface ReminderListProps {
	reminders: ReminderGetByUserDto[];
	completingId: number | null;
	onCompleteReminder: (id: number) => Promise<void>;
}

export default function ReminderList({ reminders, completingId, onCompleteReminder }: ReminderListProps) {
	const activeReminders = reminders.filter((r) => !r.IsCompleted);
	const completedReminders = reminders.filter((r) => r.IsCompleted);

	return (
		<div className="space-y-6">
			{activeReminders.length > 0 && (
				<ul className="space-y-3">
					{activeReminders.map((reminder) => (
						<ReminderItem
							key={reminder.Id}
							reminder={reminder}
							isCompleted={false}
							isCompleting={completingId === reminder.Id}
							onCompleteReminder={onCompleteReminder}
						/>
					))}
				</ul>
			)}

			{completedReminders.length > 0 && (
				<div className="pt-2 border-t border-slate-200">
					<h3 className="text-sm font-bold text-slate-500 mb-3 flex items-center gap-2">
						<CheckCircle2 size={16} />
						انجام شده‌ها
					</h3>

					<ul className="space-y-3">
						{completedReminders.map((reminder) => (
							<ReminderItem
								key={reminder.Id}
								reminder={reminder}
								isCompleted
								isCompleting={false}
								onCompleteReminder={onCompleteReminder}
							/>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}

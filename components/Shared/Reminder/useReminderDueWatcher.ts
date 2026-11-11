"use client";

import { useEffect, useRef, useState } from "react";

import { ReminderGetByUserDto } from "@/dataBinding/models/Reminder/ReminderGetByUserDto";

interface UseReminderDueWatcherParams {
	reminders: ReminderGetByUserDto[];
	enabled?: boolean;
	enableBrowserNotification?: boolean;
	showNotification?: (title: string, options?: NotificationOptions) => Promise<boolean> | boolean;
}

export function getReminderDueDate(reminder: ReminderGetByUserDto): Date | null {
	if (!reminder.EndDate) return null;

	const dueDate = new Date(reminder.EndDate);

	if (Number.isNaN(dueDate.getTime())) return null;

	return dueDate;
}

export function useReminderDueWatcher({
	reminders,
	enabled = true,
	enableBrowserNotification = false,
	showNotification,
}: UseReminderDueWatcherParams) {
	const [dueReminder, setDueReminder] = useState<ReminderGetByUserDto | null>(null);

	const notifiedIdsRef = useRef<Set<number>>(new Set());

	useEffect(() => {
		if (!enabled) return;

		const checkDueReminders = async () => {
			const now = new Date();

			const activeReminders = reminders.filter(
				(item) => !item.IsCompleted && !notifiedIdsRef.current.has(item.Id),
			);

			for (const reminder of activeReminders) {
				const dueDate = getReminderDueDate(reminder);

				if (!dueDate) continue;

				if (dueDate.getTime() <= now.getTime()) {
					notifiedIdsRef.current.add(reminder.Id);

					setDueReminder(reminder);

					if (enableBrowserNotification && showNotification) {
						await showNotification("یادآور", {
							body: reminder.Title || "زمان یادآوری فرا رسید.",
							tag: `reminder-${reminder.Id}`,
							data: {
								reminderId: reminder.Id,
							},
						});
					}

					break;
				}
			}
		};

		void checkDueReminders();

		const intervalId = window.setInterval(() => {
			checkDueReminders;
		}, 15_000);

		return () => {
			window.clearInterval(intervalId);
		};
	}, [reminders, enabled, enableBrowserNotification, showNotification]);

	const closeDuePopup = () => {
		setDueReminder(null);
	};

	return {
		dueReminder,
		closeDuePopup,
	};
}

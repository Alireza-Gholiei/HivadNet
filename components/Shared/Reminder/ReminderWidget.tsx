"use client";

import { Button } from "@/utilities/components/ui/button";

import ReminderDuePopup from "./ReminderDuePopup";
import ReminderWidgetButton from "./ReminderWidgetButton";
import ReminderWidgetPanel from "./ReminderWidgetPanel";
import { useReminderDueWatcher } from "./useReminderDueWatcher";
import { useReminderServiceWorker } from "./useReminderServiceWorker";
import { useReminderWidget } from "./useReminderWidget";

export default function ReminderWidget() {
	const widget = useReminderWidget();

	const reminderServiceWorker = useReminderServiceWorker();

	const { dueReminder, closeDuePopup } = useReminderDueWatcher({
		reminders: widget.reminders,
		enabled: true,
		enableBrowserNotification: true,
		showNotification: reminderServiceWorker.showNotification,
	});

	return (
		<div>
			<ReminderWidgetButton isOpen={widget.isOpen} onClick={widget.toggleWidget} />

			{reminderServiceWorker.isSupported &&
				typeof window !== "undefined" &&
				Notification.permission !== "granted" && (
					<Button
						type="button"
						size="sm"
						onClick={() => void reminderServiceWorker.requestPermission()}
						className="fixed bottom-24 left-5 z-9999 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-lg"
					>
						فعال‌سازی اعلان‌ها
					</Button>
				)}

			<ReminderWidgetPanel
				isOpen={widget.isOpen}
				view={widget.view}
				widgetRef={widget.widgetRef}
				reminders={widget.reminders}
				reminderTypes={widget.reminderTypes}
				isLoadingList={widget.isLoadingList}
				listError={widget.listError}
				completingId={widget.completingId}
				onClose={widget.closeWidget}
				onGoToList={widget.goToList}
				onGoToAdd={widget.goToAdd}
				onAddReminder={widget.addReminder}
				onCompleteReminder={widget.completeReminder}
			/>

			<ReminderDuePopup
				reminder={dueReminder}
				onClose={closeDuePopup}
				onComplete={widget.completeReminder}
				isCompleting={dueReminder ? widget.completingId === dueReminder.Id : false}
			/>
		</div>
	);
}

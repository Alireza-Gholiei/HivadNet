import { RefObject } from "react";

import { ReminderAddDto } from "@/dataBinding/models/Reminder/ReminderAddDto";
import { ReminderGetByUserDto } from "@/dataBinding/models/Reminder/ReminderGetByUserDto";
import { ReminderTypeDto } from "@/dataBinding/models/Reminder/ReminderTypeDto";

import ReminderFormView from "./ReminderFormView";
import ReminderListView from "./ReminderListView";
import ReminderWidgetHeader from "./ReminderWidgetHeader";

type ReminderWidgetView = "list" | "add";

interface ReminderWidgetPanelProps {
	isOpen: boolean;
	view: ReminderWidgetView;
	widgetRef: RefObject<HTMLDivElement | null>;

	reminders: ReminderGetByUserDto[];
	reminderTypes: ReminderTypeDto[];
	isLoadingList: boolean;
	listError: string | null;
	completingId: number | null;

	onClose: () => void;
	onGoToList: () => void;
	onGoToAdd: () => void;
	onAddReminder: (data: ReminderAddDto) => Promise<unknown>;
	onCompleteReminder: (id: number) => Promise<void>;
}

export default function ReminderWidgetPanel({
	isOpen,
	view,
	widgetRef,
	reminders,
	reminderTypes,
	isLoadingList,
	listError,
	completingId,
	onClose,
	onGoToList,
	onGoToAdd,
	onAddReminder,
	onCompleteReminder,
}: ReminderWidgetPanelProps) {
	return (
		<div
			ref={widgetRef}
			className={`fixed bottom-1 md:bottom-6 md:left-6 w-105 max-h-[90vh] bg-slate-50/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-2xl shadow-slate-900/10 flex flex-col transition-all duration-300 ease-in-out z-50 overflow-hidden ${
				isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
			}`}
		>
			<ReminderWidgetHeader view={view} onClose={onClose} onGoToList={onGoToList} />

			<div className="grow overflow-y-auto">
				{view === "list" ? (
					<ReminderListView
						reminders={reminders}
						isLoading={isLoadingList}
						error={listError}
						completingId={completingId}
						onGoToAdd={onGoToAdd}
						onCompleteReminder={onCompleteReminder}
					/>
				) : (
					<ReminderFormView reminderTypes={reminderTypes} onSubmitReminder={onAddReminder} />
				)}
			</div>
		</div>
	);
}

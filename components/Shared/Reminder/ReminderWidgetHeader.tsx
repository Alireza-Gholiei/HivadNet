import { ArrowRight, X } from "lucide-react";

import { Button } from "@/utilities/components/ui/button";

type ReminderWidgetView = "list" | "add";

interface ReminderWidgetHeaderProps {
	view: ReminderWidgetView;
	onClose: () => void;
	onGoToList: () => void;
}

export default function ReminderWidgetHeader({ view, onClose, onGoToList }: ReminderWidgetHeaderProps) {
	return (
		<header className="flex justify-between items-center p-4 border-b border-slate-200/80 shrink-0">
			<div className="flex items-center gap-2">
				{view === "add" && (
					<Button
						variant="outline"
						size="sm"
						type="button"
						onClick={onGoToList}
						className="p-1 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
						title="بازگشت به لیست"
					>
						<ArrowRight size={20} />
					</Button>
				)}

				<h2 className="font-bold text-lg text-slate-800">
					{view === "list" ? "لیست یادآورها" : "ثبت یادآور جدید"}
				</h2>
			</div>

			<Button
				variant="outline"
				size="sm"
				type="button"
				onClick={onClose}
				className="p-1.5 rounded-full text-slate-400 hover:bg-slate-500/20 hover:text-slate-700 transition-colors"
			>
				<X size={20} />
			</Button>
		</header>
	);
}

import { MessageSquareText } from "lucide-react";

import { Button } from "@/utilities/components/ui/button";

interface ReminderWidgetButtonProps {
	isOpen: boolean;
	onClick: () => void;
}

export default function ReminderWidgetButton({ isOpen, onClick }: ReminderWidgetButtonProps) {
	return (
		<Button
			type="button"
			size="sm"
			onClick={onClick}
			className={`fixed bottom-6 left-6 w-16 h-16 rounded-full flex items-center justify-center text-white bg-linear-to-br from-indigo-500 to-indigo-600 shadow-lg hover:shadow-xl hover:bg-linear-to-br hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300 transform hover:scale-110 z-50 ${
				isOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
			}`}
			aria-label="Open Reminder Widget"
		>
			<MessageSquareText size={32} />
		</Button>
	);
}

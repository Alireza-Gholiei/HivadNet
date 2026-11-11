import React, { Suspense } from "react";

import PageHeaderLayout from "@/components/Shared/PageHeaderLayout";
import ReminderWidget from "@/components/Shared/Reminder/ReminderWidget";
import Sidebar from "@/components/Shared/Sidebar/Sidebar";
import ChatNotificationBackground from "@/components/user/ChatNotificationBackground";
import { HeaderProvider } from "@/dataBinding/hocks/HeaderContext";

export default function RootsLayout({ children }: { children: React.ReactNode }) {
	return (
		<HeaderProvider>
			<div className="min-h-screen bg-slate-100 text-slate-800 relative">
				<Sidebar />

				<main className="min-h-screen transition-all mb-10 duration-300 lg:mr-(--sidebar-width) flex flex-col">
					<PageHeaderLayout />

					<div className="flex-1">{children}</div>
				</main>

				<ReminderWidget />
				<Suspense fallback={null}>
					<ChatNotificationBackground />
				</Suspense>
			</div>
		</HeaderProvider>
	);
}

"use client";

import * as LucideIcons from "lucide-react";

interface Props {
	onClick: () => void;
}

export function SidebarMobileToggle({ onClick }: Props) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="fixed right-1.5 top-4 z-60 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-400 bg-white/85 text-slate-700 shadow-lg shadow-slate-900/10 backdrop-blur-xl transition hover:bg-white lg:hidden"
			aria-label="باز کردن منو"
		>
			<LucideIcons.Menu className="h-6 w-6" />
		</button>
	);
}

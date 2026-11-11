"use client";

import { cn } from "@/utilities/lib/utils";

interface Props {
	isOpen: boolean;
	onClick: () => void;
}

export function SidebarOverlay({ isOpen, onClick }: Props) {
	return (
		<div
			onClick={onClick}
			className={cn(
				"fixed inset-0 z-70 bg-slate-950/55 backdrop-blur-sm transition-all duration-300 lg:hidden",
				isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
			)}
		/>
	);
}

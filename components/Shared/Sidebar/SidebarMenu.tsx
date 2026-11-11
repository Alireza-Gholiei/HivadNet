"use client";

import * as LucideIcons from "lucide-react";

import type { MenuItem } from "./sidebar.types";
import { SidebarMenuItem } from "./SidebarMenuItem";

interface Props {
	menuItems: MenuItem[];
	isLoadingMenu: boolean;
	isDesktopExpanded: boolean;
	pathname: string;
	openSubmenus: Record<string, boolean>;
	toggleSubmenu: (title: string) => void;
}

export function SidebarMenu({
	menuItems,
	isLoadingMenu,
	isDesktopExpanded,
	pathname,
	openSubmenus,
	toggleSubmenu,
}: Props) {
	return (
		<div className="flex-1 overflow-y-auto px-3 py-5 scrollbar-thin [scrollbar-color:#cbd5e1_transparent]">
			{isDesktopExpanded && (
				<div className="mb-3 flex items-center justify-between px-3">
					<p className="text-xs font-bold tracking-wide text-slate-400">منوی اصلی</p>
					<span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
						Menu
					</span>
				</div>
			)}

			{isLoadingMenu ? (
				<div className="space-y-2 px-2">
					{Array.from({ length: 7 }).map((_, index) => (
						<div key={index} className="h-11 animate-pulse rounded-2xl bg-slate-100" />
					))}
				</div>
			) : menuItems.length === 0 ? (
				<div className="mx-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center">
					<LucideIcons.FolderX className="mx-auto mb-2 h-6 w-6 text-slate-400" />
					<p className="text-sm font-medium text-slate-500">منویی برای نمایش وجود ندارد</p>
				</div>
			) : (
				<nav className="space-y-1">
					{menuItems.map((item) => (
						<SidebarMenuItem
							key={item.title}
							item={item}
							pathname={pathname}
							isDesktopExpanded={isDesktopExpanded}
							openSubmenus={openSubmenus}
							toggleSubmenu={toggleSubmenu}
						/>
					))}
				</nav>
			)}
		</div>
	);
}

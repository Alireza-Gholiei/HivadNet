"use client";

import * as LucideIcons from "lucide-react";
import Link from "next/link";

import type { MenuItem } from "./sidebar.types";
import { findActivePath, isHrefActive } from "./sidebar.utils";
import { SidebarSubMenu } from "./SidebarSubMenu";
import { cn } from "@/utilities/lib/utils";

interface Props {
	item: MenuItem;
	pathname: string;
	isDesktopExpanded: boolean;
	openSubmenus: Record<string, boolean>;
	toggleSubmenu: (title: string) => void;
}

export function SidebarMenuItem({ item, pathname, isDesktopExpanded, openSubmenus, toggleSubmenu }: Props) {
	const Icon = item.icon;
	const hasSubmenu = !!item.subItems?.length;
	const isSubmenuOpen = openSubmenus[item.title];
	const isParentActive = hasSubmenu && findActivePath(pathname, item.subItems!);
	const isLocked = !!item.isLockedByLicense;

	const isActive = !isLocked && (isHrefActive(pathname, item.href) || isParentActive);

	const lockedTitle = item.lockMessage || "این قابلیت در نسخه فعلی شما فعال نیست.";

	const upgradeHref = item.id ? `/subscription/upgrade?feature=${item.id}` : "/subscription/upgrade";

	return (
		<div className="w-full">
			{hasSubmenu ? (
				<button
					type="button"
					title={!isDesktopExpanded ? item.title : lockedTitle}
					onClick={() => toggleSubmenu(item.title)}
					className={cn(
						"group relative flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold transition-all duration-200",
						isDesktopExpanded ? "justify-between" : "justify-center",

						isLocked
							? "border border-amber-200/70 bg-amber-50/60 text-amber-700 hover:bg-amber-100/80"
							: isActive || isSubmenuOpen
								? "bg-linear-to-l from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20"
								: "text-slate-600 hover:bg-slate-100/80 hover:text-slate-950",
					)}
				>
					<div className={cn("flex min-w-0 items-center gap-3", !isDesktopExpanded && "justify-center")}>
						<span
							className={cn(
								"flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition",
								isLocked
									? "bg-amber-100 text-amber-600"
									: isActive || isSubmenuOpen
										? "bg-white/15 text-white"
										: "bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-indigo-600",
							)}
						>
							<Icon className="h-5 w-5" />
						</span>

						{isDesktopExpanded && (
							<div className="flex min-w-0 flex-1 flex-col items-start">
								<div className="flex min-w-0 items-center gap-2">
									<span className="truncate">{item.title}</span>

									{isLocked && (
										<LucideIcons.LockKeyhole className="h-3.5 w-3.5 shrink-0 text-amber-500" />
									)}
								</div>

								{isLocked && (
									<span className="mt-0.5 line-clamp-1 text-[10px] font-medium text-amber-600/90">
										{lockedTitle}
									</span>
								)}
							</div>
						)}
					</div>

					{isDesktopExpanded && (
						<div className="flex shrink-0 items-center gap-2">
							{/* {isLocked && (
								<Link
									href={upgradeHref}
									onClick={(e) => e.stopPropagation()}
									className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-black text-white shadow-sm hover:bg-amber-600"
								>
									ارتقا
								</Link>
							)} */}

							<LucideIcons.ChevronDown
								className={cn(
									"h-4 w-4 shrink-0 transition-transform duration-200",
									isSubmenuOpen ? "rotate-180" : "",
								)}
							/>
						</div>
					)}
				</button>
			) : (
				<Link
					href={isLocked ? upgradeHref : item.href || "#"}
					title={!isDesktopExpanded ? item.title : lockedTitle}
					className={cn(
						"group relative flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold transition-all duration-200",
						isDesktopExpanded ? "justify-start" : "justify-center",

						isLocked
							? "border border-amber-200/70 bg-amber-50/60 text-amber-700 hover:bg-amber-100/80"
							: isActive
								? "bg-linear-to-l from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20"
								: "text-slate-600 hover:bg-slate-100/80 hover:text-slate-950",
					)}
				>
					<span
						className={cn(
							"flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition",
							isLocked
								? "bg-amber-100 text-amber-600"
								: isActive
									? "bg-white/15 text-white"
									: "bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-indigo-600",
						)}
					>
						<Icon className="h-5 w-5" />
					</span>

					{isDesktopExpanded && (
						<div className="flex min-w-0 flex-1 flex-col">
							<div className="flex min-w-0 items-center gap-2">
								<span className="truncate">{item.title}</span>

								{isLocked && (
									<LucideIcons.LockKeyhole className="h-3.5 w-3.5 shrink-0 text-amber-500" />
								)}
							</div>

							{isLocked && (
								<span className="mt-0.5 line-clamp-1 text-[10px] font-medium text-amber-600/90">
									{lockedTitle}
								</span>
							)}
						</div>
					)}

					{/* {isDesktopExpanded && isLocked && (
						<span className="mr-auto shrink-0 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-black text-white shadow-sm">
							ارتقا
						</span>
					)} */}
				</Link>
			)}

			{hasSubmenu && isDesktopExpanded && (
				<div
					className={cn(
						"grid transition-all duration-300 ease-in-out",
						isSubmenuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
					)}
				>
					<div className="overflow-hidden">
						<div className="mt-2 space-y-1 border-r border-slate-200/80 pr-3">
							<SidebarSubMenu
								items={item.subItems!}
								pathname={pathname}
								openSubmenus={openSubmenus}
								toggleSubmenu={toggleSubmenu}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

"use client";

import * as LucideIcons from "lucide-react";
import Link from "next/link";

import type { SubMenuItem } from "./sidebar.types";
import { findActivePath, isHrefActive } from "./sidebar.utils";
import { cn } from "@/utilities/lib/utils";

interface Props {
	items: SubMenuItem[];
	pathname: string;
	openSubmenus: Record<string, boolean>;
	toggleSubmenu: (title: string) => void;
	level?: number;
}

export function SidebarSubMenu({ items, pathname, openSubmenus, toggleSubmenu, level = 1 }: Props) {
	return (
		<>
			{items.map((subItem) => {
				const hasSubmenu = !!subItem.subItems?.length;
				const isSubmenuOpen = openSubmenus[subItem.title];

				const isLocked = !!subItem.isLockedByLicense;

				const isSubActive = !isLocked && !hasSubmenu && isHrefActive(pathname, subItem.href);

				const isParentActive = !isLocked && hasSubmenu && findActivePath(pathname, subItem.subItems!);

				const SubIcon = subItem.icon;

				const lockMessage = subItem.lockMessage || "این قابلیت در نسخه فعلی شما فعال نیست.";

				const upgradeHref = subItem.id
					? `/subscription/upgrade?feature=${subItem.id}`
					: "/subscription/upgrade";

				return (
					<div key={subItem.title} className="w-full">
						{hasSubmenu ? (
							<button
								type="button"
								title={isLocked ? lockMessage : subItem.title}
								onClick={() => toggleSubmenu(subItem.title)}
								className={cn(
									"group relative flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
									isLocked
										? "border border-amber-200/70 bg-amber-50/70 text-amber-700 hover:bg-amber-100/80"
										: isSubmenuOpen || isParentActive
											? "bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100/70"
											: "text-slate-500 hover:bg-slate-100/80 hover:text-slate-900",
								)}
								style={{ paddingRight: `${12 + level * 8}px` }}
							>
								<div className="flex min-w-0 items-center gap-2">
									{SubIcon ? (
										<SubIcon
											className={cn(
												"h-4 w-4 shrink-0 transition-colors",
												isLocked
													? "text-amber-600"
													: isSubmenuOpen || isParentActive
														? "text-indigo-600"
														: "text-slate-400 group-hover:text-slate-600",
											)}
										/>
									) : (
										<span
											className={cn(
												"h-1.5 w-1.5 shrink-0 rounded-full",
												isLocked
													? "bg-amber-500"
													: isSubmenuOpen || isParentActive
														? "bg-indigo-600"
														: "bg-slate-300",
											)}
										/>
									)}

									<div className="flex min-w-0 flex-col items-start">
										<div className="flex min-w-0 items-center gap-1.5">
											<span className="truncate">{subItem.title}</span>

											{isLocked && (
												<LucideIcons.LockKeyhole className="h-3.5 w-3.5 shrink-0 text-amber-500" />
											)}
										</div>

										{isLocked && (
											<span className="mt-0.5 line-clamp-1 text-[10px] font-medium text-amber-600/90">
												{lockMessage}
											</span>
										)}
									</div>
								</div>

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
											"h-3.5 w-3.5 shrink-0 transition-transform duration-200",
											isLocked ? "text-amber-500" : isSubmenuOpen ? "rotate-180" : "",
											isSubmenuOpen ? "rotate-180" : "",
										)}
									/>
								</div>
							</button>
						) : (
							<Link
								href={isLocked ? upgradeHref : subItem.href || "#"}
								title={isLocked ? lockMessage : subItem.title}
								className={cn(
									"group relative mt-1 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
									isLocked
										? "border border-amber-200/70 bg-amber-50/70 text-amber-700 hover:bg-amber-100/80"
										: isSubActive
											? "bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100/70"
											: "text-slate-500 hover:bg-slate-100/80 hover:text-slate-900",
								)}
								style={{ paddingRight: `${12 + level * 8}px` }}
							>
								{isSubActive && !isLocked && (
									<span className="absolute right-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-l-full bg-indigo-600" />
								)}

								{SubIcon ? (
									<SubIcon
										className={cn(
											"h-4 w-4 shrink-0 transition-colors",
											isLocked
												? "text-amber-600"
												: isSubActive
													? "text-indigo-600"
													: "text-slate-400 group-hover:text-slate-600",
										)}
									/>
								) : (
									<span
										className={cn(
											"h-1.5 w-1.5 shrink-0 rounded-full",
											isLocked ? "bg-amber-500" : isSubActive ? "bg-indigo-600" : "bg-slate-300",
										)}
									/>
								)}

								<div className="flex min-w-0 flex-1 flex-col">
									<div className="flex min-w-0 items-center gap-1.5">
										<span className="truncate">{subItem.title}</span>

										{isLocked && (
											<LucideIcons.LockKeyhole className="h-3.5 w-3.5 shrink-0 text-amber-500" />
										)}
									</div>

									{isLocked && (
										<span className="mt-0.5 line-clamp-1 text-[10px] font-medium text-amber-600/90">
											{lockMessage}
										</span>
									)}
								</div>

								{/* {isLocked && (
									<span className="shrink-0 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-black text-white shadow-sm">
										ارتقا
									</span>
								)} */}
							</Link>
						)}

						{hasSubmenu && (
							<div
								className={cn(
									"grid transition-all duration-300 ease-in-out",
									isSubmenuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
								)}
							>
								<div className="overflow-hidden">
									<div className="mt-1 border-r border-slate-200/80 pr-2">
										<SidebarSubMenu
											items={subItem.subItems!}
											pathname={pathname}
											openSubmenus={openSubmenus}
											toggleSubmenu={toggleSubmenu}
											level={level + 1}
										/>
									</div>
								</div>
							</div>
						)}
					</div>
				);
			})}
		</>
	);
}

"use client";

import * as LucideIcons from "lucide-react";
import Image from "next/image";

interface Props {
	isDesktopExpanded: boolean;
	isDesktopCollapsed: boolean;
	setIsDesktopCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
	onCloseMobile: () => void;
}

export function SidebarHeader({ isDesktopExpanded, isDesktopCollapsed, setIsDesktopCollapsed, onCloseMobile }: Props) {
	return (
		<div className="relative shrink-0 overflow-hidden border-b border-slate-200/70 px-4 py-4">
			<div className="absolute inset-0 bg-linear-to-l from-indigo-50 via-white to-white" />

			<div className={`relative flex items-center ${isDesktopExpanded ? "justify-between" : "justify-center"}`}>
				<div className="flex items-center gap-3">
					<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-lg shadow-indigo-500/25">
						<Image alt="لوگو" src={"/logo.png"} width={35} height={35} loading="eager" />
					</div>

					{isDesktopExpanded && (
						<div className="min-w-0">
							<h1 className="truncate text-base font-extrabold text-slate-900">هیوادنت</h1>
							<p className="text-xs font-medium text-slate-500">پنل مدیریت</p>
						</div>
					)}
				</div>

				<div className="flex items-center gap-1">
					<button
						type="button"
						onClick={() => setIsDesktopCollapsed((prev) => !prev)}
						className="hidden h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600 lg:inline-flex"
						aria-label={isDesktopCollapsed ? "باز کردن سایدبار" : "بستن سایدبار"}
					>
						{isDesktopCollapsed ? (
							<LucideIcons.ChevronsLeft className="h-5 w-5" />
						) : (
							<LucideIcons.ChevronsRight className="h-5 w-5" />
						)}
					</button>

					<button
						type="button"
						onClick={onCloseMobile}
						className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 lg:hidden"
						aria-label="بستن منو"
					>
						<LucideIcons.X className="h-5 w-5" />
					</button>
				</div>
			</div>
		</div>
	);
}

"use client";

import * as LucideIcons from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { GetUserRolesDto } from "@/dataBinding/models/User/GetUserRolesDto";
import { cn } from "@/utilities/lib/utils";

interface Props {
	isDesktopExpanded: boolean;
	fetchedUserName: string;
	fetchedRoleName: string;
	availableRoles: GetUserRolesDto[];
	isDropdownOpen: boolean;
	setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
	onRoleSelect: (role: GetUserRolesDto) => Promise<void>;
	onLogout: () => Promise<void>;
}

export function SidebarUserSection({
	isDesktopExpanded,
	fetchedUserName,
	fetchedRoleName,
	availableRoles,
	isDropdownOpen,
	setIsDropdownOpen,
	onRoleSelect,
	onLogout,
}: Props) {
	const dropdownRef = useRef<HTMLDivElement>(null);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();

		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [setIsDropdownOpen]);

	const shouldShowExpanded = isDesktopExpanded || isMobile;

	return (
		<div className="shrink-0 border-t border-slate-200/70 bg-linear-to-t from-slate-50 to-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
			{shouldShowExpanded ? (
				<>
					<div className="relative" ref={dropdownRef}>
						<div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
							<div className="flex items-center gap-3">
								<div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-100 to-violet-100 text-base font-extrabold text-indigo-700">
									{fetchedUserName ? fetchedUserName.charAt(0) : "؟"}
									<span className="absolute -bottom-0.5 -left-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
								</div>

								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-extrabold text-slate-900">{fetchedUserName}</p>

									<button
										type="button"
										onClick={() => setIsDropdownOpen((prev) => !prev)}
										className="mt-1 flex max-w-full items-center gap-1 text-xs font-bold text-slate-500 transition hover:text-indigo-600 disabled:cursor-default disabled:hover:text-slate-500"
										disabled={availableRoles?.length <= 1}
									>
										<span className="truncate">{fetchedRoleName || "در حال بارگذاری..."}</span>

										{availableRoles?.length > 1 && (
											<LucideIcons.ChevronDown
												className={cn(
													"h-3.5 w-3.5 shrink-0 transition-transform duration-200",
													isDropdownOpen ? "rotate-180 text-indigo-600" : "text-slate-400",
												)}
											/>
										)}
									</button>
								</div>
							</div>
						</div>

						{isDropdownOpen && availableRoles.length > 1 && (
							<div className="absolute bottom-full left-0 right-0 z-50 mb-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
								<div className="max-h-60 overflow-y-auto p-1">
									{availableRoles.map((role) => {
										const selected = fetchedRoleName === role.RoleName;

										return (
											<button
												type="button"
												key={role.RoleId}
												onClick={() => void onRoleSelect(role)}
												className={cn(
													"flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-right text-sm font-bold transition",
													selected
														? "bg-indigo-50 text-indigo-700"
														: "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
												)}
											>
												<span
													className={cn(
														"h-2 w-2 shrink-0 rounded-full",
														selected ? "bg-indigo-600" : "bg-slate-300",
													)}
												/>

												<span className="truncate">{role.RoleName}</span>

												{selected && (
													<LucideIcons.Check className="mr-auto h-4 w-4 text-indigo-600" />
												)}
											</button>
										);
									})}
								</div>
							</div>
						)}
					</div>

					<button
						type="button"
						onClick={() => void onLogout()}
						className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-100 bg-rose-50 px-3 py-3 text-sm font-extrabold text-rose-600 transition hover:bg-rose-600 hover:text-white hover:shadow-lg hover:shadow-rose-500/20"
					>
						<LucideIcons.LogOut className="h-4 w-4" />
						خروج از سیستم
					</button>
				</>
			) : (
				<div className="flex flex-col items-center gap-3">
					<button
						type="button"
						title={fetchedUserName}
						className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-100 to-violet-100 text-base font-extrabold text-indigo-700 transition hover:scale-105"
					>
						{fetchedUserName ? fetchedUserName.charAt(0) : "؟"}
						<span className="absolute -bottom-0.5 -left-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
					</button>

					<button
						type="button"
						onClick={() => void onLogout()}
						title="خروج از سیستم"
						className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-100 bg-rose-50 text-rose-600 transition hover:bg-rose-600 hover:text-white"
					>
						<LucideIcons.LogOut className="h-5 w-5" />
					</button>
				</div>
			)}
		</div>
	);
}

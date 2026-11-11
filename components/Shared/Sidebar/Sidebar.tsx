"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { GetUserRolesDto } from "@/dataBinding/models/User/GetUserRolesDto";
import { TokenService } from "@/utilities/services/token.service";

import { findActivePath } from "./sidebar.utils";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarMenu } from "./SidebarMenu";
import { SidebarMobileToggle } from "./SidebarMobileToggle";
import { SidebarOverlay } from "./SidebarOverlay";
import { SidebarUserSection } from "./SidebarUserSection";
import { useSidebarData } from "./useSidebarData";
import { useSidebarState } from "./useSidebarState";
import { cn } from "@/utilities/lib/utils";

export default function Sidebar() {
	const router = useRouter();
	const pathname = usePathname();

	const {
		isOpen,
		setIsOpen,
		isDesktopCollapsed,
		setIsDesktopCollapsed,
		setIsDesktopHovering,
		isDesktopExpanded,
		openSubmenus,
		setOpenSubmenus,
		toggleSubmenu,
		isDropdownOpen,
		setIsDropdownOpen,
	} = useSidebarState();

	const { menuItems, isLoadingMenu, fetchedUserName, fetchedRoleName, setFetchedRoleName, availableRoles } =
		useSidebarData("");

	useEffect(() => {
		if (menuItems.length === 0) return;

		const newOpenSubmenus: Record<string, boolean> = {};

		const checkAndOpen = (items: any[]) => {
			items.forEach((item) => {
				if (item.subItems?.length > 0) {
					if (findActivePath(pathname, item.subItems)) {
						newOpenSubmenus[item.title] = true;
					}
					checkAndOpen(item.subItems);
				}
			});
		};

		checkAndOpen(menuItems);
		setOpenSubmenus((prev) => ({ ...prev, ...newOpenSubmenus }));
	}, [pathname, menuItems, setOpenSubmenus]);

	useEffect(() => {
		setIsOpen(false);
	}, [pathname, setIsOpen]);

	const handleRoleSelect = async (role: GetUserRolesDto) => {
		setFetchedRoleName(role.RoleName);
		await TokenService.setRoleId(role.RoleId.toString());
		setIsDropdownOpen(false);
		router.refresh();
	};

	const logout = async () => {
		try {
			await TokenService.clearTokens();
			router.push("/login");
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<>
			<SidebarMobileToggle onClick={() => setIsOpen(true)} />
			<SidebarOverlay isOpen={isOpen} onClick={() => setIsOpen(false)} />

			<aside
				dir="rtl"
				onMouseEnter={() => {
					if (isDesktopCollapsed) setIsDesktopHovering(true);
				}}
				onMouseLeave={() => {
					if (isDesktopCollapsed) setIsDesktopHovering(false);
				}}
				className={cn(
					"fixed right-0 top-0 z-80 flex h-dvh flex-col overflow-hidden border-l border-white/70 bg-white/95 backdrop-blur-xl shadow-2xl shadow-slate-900/10",
					"transition-[width,transform,opacity] duration-300 ease-out",
					isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
					"lg:translate-x-0 lg:opacity-100",
					isDesktopExpanded ? "lg:w-72.5" : "lg:w-21",
					"w-72.5",
				)}
			>
				<SidebarHeader
					isDesktopExpanded={isDesktopExpanded}
					isDesktopCollapsed={isDesktopCollapsed}
					setIsDesktopCollapsed={setIsDesktopCollapsed}
					onCloseMobile={() => setIsOpen(false)}
				/>

				<SidebarMenu
					menuItems={menuItems}
					isLoadingMenu={isLoadingMenu}
					isDesktopExpanded={isDesktopExpanded}
					pathname={pathname}
					openSubmenus={openSubmenus}
					toggleSubmenu={toggleSubmenu}
				/>

				<SidebarUserSection
					isDesktopExpanded={isOpen || isDesktopExpanded}
					fetchedUserName={fetchedUserName}
					fetchedRoleName={fetchedRoleName}
					availableRoles={availableRoles}
					isDropdownOpen={isDropdownOpen}
					setIsDropdownOpen={setIsDropdownOpen}
					onRoleSelect={handleRoleSelect}
					onLogout={logout}
				/>
			</aside>
		</>
	);
}

"use client";

import { useEffect, useState } from "react";

const SIDEBAR_EXPANDED_WIDTH = "290px";
const SIDEBAR_COLLAPSED_WIDTH = "84px";

export function useSidebarState() {
	const [isOpen, setIsOpen] = useState(false);
	const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
	const [isDesktopHovering, setIsDesktopHovering] = useState(false);
	const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const isDesktopExpanded = !isDesktopCollapsed || isDesktopHovering;

	useEffect(() => {
		const savedState = localStorage.getItem("sidebar-collapsed");
		if (savedState) {
			setIsDesktopCollapsed(savedState === "true");
		}
	}, []);

	useEffect(() => {
		const width = isDesktopCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH;
		document.documentElement.style.setProperty("--sidebar-width", width);
		localStorage.setItem("sidebar-collapsed", String(isDesktopCollapsed));
	}, [isDesktopCollapsed]);

	useEffect(() => {
		document.body.style.overflow = isOpen ? "hidden" : "unset";
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	const toggleSubmenu = (title: string) => {
		setOpenSubmenus((prev) => ({ ...prev, [title]: !prev[title] }));
	};

	return {
		isOpen,
		setIsOpen,
		isDesktopCollapsed,
		setIsDesktopCollapsed,
		isDesktopHovering,
		setIsDesktopHovering,
		isDesktopExpanded,
		openSubmenus,
		setOpenSubmenus,
		toggleSubmenu,
		isDropdownOpen,
		setIsDropdownOpen,
	};
}

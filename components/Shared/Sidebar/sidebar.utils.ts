import * as LucideIcons from "lucide-react";
import type { ElementType } from "react";

import { FormMenuDto } from "@/dataBinding/models/Form/FormMenuDto";

import type { MenuItem, SubMenuItem } from "./sidebar.types";

export const getIconComponent = (iconName: string): ElementType => {
	const Icon = (LucideIcons as any)[iconName];
	return Icon || LucideIcons.Circle;
};

type AnySidebarItem = MenuItem | SubMenuItem;

export function isHrefActive(pathname: string, href?: string | null): boolean {
	if (!href || href === "#") return false;

	if (href === "/") {
		return pathname === "/";
	}

	return pathname === href;
}

export function findActivePath(pathname: string, items: AnySidebarItem[]): boolean {
	return items.some((item) => {
		if (item.isLockedByLicense) return false;

		if (isHrefActive(pathname, item.href)) return true;

		if (item.subItems?.length) {
			return findActivePath(pathname, item.subItems);
		}

		return false;
	});
}

export const mapMenus = (items: FormMenuDto[]): MenuItem[] => {
	return items
		.sort((a, b) => a.Order - b.Order)
		.map((item) => ({
			id: item.Id,
			title: item.Name,
			href: item.FormUrl || undefined,
			icon: getIconComponent(item.Icon),
			isLockedByLicense: item.IsLockedByLicense,
			lockMessage: item.LockMessage,
			requiredLicense: item.RequiredLicense,
			formType: item.FormType,
			order: item.Order,
			subItems: item.Children?.length ? mapMenus(item.Children) : undefined,
		}));
};

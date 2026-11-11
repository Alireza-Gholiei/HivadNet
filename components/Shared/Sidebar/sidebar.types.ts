import { ElementType } from "react";

export interface SubMenuItem {
	id: number;
	title: string;
	href?: string;
	icon?: ElementType;
	order?: number;
	formType?: number;
	isLockedByLicense?: boolean;
	lockMessage?: string | null;
	requiredLicense?: LicenseType;
	subItems?: SubMenuItem[];
}

export interface MenuItem {
	id: number;
	title: string;
	href?: string;
	icon: ElementType;
	order?: number;
	formType?: number;
	isLockedByLicense?: boolean;
	lockMessage?: string | null;
	requiredLicense?: LicenseType;
	subItems?: SubMenuItem[];
}

export enum LicenseType {
	None = 0,
	Trial = 1,
	Standard = 2,
	Premium = 3,
	Lifetime = 4,
}

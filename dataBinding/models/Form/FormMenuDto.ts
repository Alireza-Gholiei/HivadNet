import { LicenseType } from "@/components/Shared/Sidebar/sidebar.types";

export interface FormMenuDto {
	Id: number;
	Name: string;
	Icon: string;
	FormUrl: string;
	FormType: number;
	Order: number;
	Children?: FormMenuDto[];
	IsLockedByLicense?: boolean;
	LockMessage?: string | null;
	RequiredLicense?: LicenseType;
}

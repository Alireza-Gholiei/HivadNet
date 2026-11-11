"use client";

import { useEffect, useState } from "react";

import { FormMenuDto } from "@/dataBinding/models/Form/FormMenuDto";
import { GetUserRolesDto } from "@/dataBinding/models/User/GetUserRolesDto";
import { FormService } from "@/dataBinding/services/Form/FormService";
import { UserRoleService } from "@/dataBinding/services/User/UserRoleService";
import { TokenService } from "@/utilities/services/token.service";

import type { MenuItem } from "./sidebar.types";
import { mapMenus } from "./sidebar.utils";

export function useSidebarData(selectedRoleName: string) {
	const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
	const [isLoadingMenu, setIsLoadingMenu] = useState(true);
	const [fetchedUserName, setFetchedUserName] = useState("کاربر");
	const [fetchedRoleName, setFetchedRoleName] = useState("");
	const [availableRoles, setAvailableRoles] = useState<GetUserRolesDto[]>([]);

	useEffect(() => {
		const fetchUserDetail = async () => {
			const userDetail = await TokenService.getUserDetail();
			if (userDetail?.fullName) setFetchedUserName(userDetail.fullName);
		};

		void fetchUserDetail();
	}, []);

	useEffect(() => {
		const fetchRoles = async () => {
			const [roleId, rolesData] = await Promise.all([TokenService.getRoleId(), UserRoleService.GetUserRoles()]);

			setAvailableRoles(rolesData);

			if (roleId && rolesData?.length > 0) {
				const selectedRole = rolesData.find((role) => role.RoleId === Number(roleId));
				setFetchedRoleName(selectedRole?.RoleName || rolesData[0].RoleName);
			} else if (rolesData?.length > 0) {
				setFetchedRoleName(rolesData[0].RoleName);
			}
		};

		void fetchRoles();
	}, []);

	useEffect(() => {
		const fetchMenus = async () => {
			setIsLoadingMenu(true);

			try {
				const result: FormMenuDto[] = await FormService.GetMenu();
				setMenuItems(result ? mapMenus(result) : []);
			} finally {
				setIsLoadingMenu(false);
			}
		};

		if (selectedRoleName || fetchedRoleName) {
			void fetchMenus();
		}
	}, [selectedRoleName, fetchedRoleName]);

	return {
		menuItems,
		isLoadingMenu,
		fetchedUserName,
		fetchedRoleName,
		setFetchedRoleName,
		availableRoles,
	};
}

import { GetUserRolesDto } from "@/dataBinding/models/User/GetUserRolesDto";
import { UserRoleAddDto } from "@/dataBinding/models/User/UserRole/UserRoleAddDto";
import { UserRoleGetGridDto } from "@/dataBinding/models/User/UserRole/UserRoleGetGridDto";
import { BaseGrid } from "@/utilities/models/Grid/base-grid.model";
import { http } from "@/utilities/services/http.service";
import { StaticsUrl } from "@/utilities/StaticsUrl";

export const UserRoleService = {
	baseUrl: `${StaticsUrl.DevUrl}v1/UserRole/`,

	async GetUserRoles(): Promise<GetUserRolesDto[]> {
		return await http.get<GetUserRolesDto[]>(`${this.baseUrl}GetUserRoles`);
	},
	async Add(data: UserRoleAddDto): Promise<boolean> {
		return await http.post<UserRoleAddDto, boolean>(`${this.baseUrl}Role`, data);
	},
	async GetGrid(baseGrid: BaseGrid) {
		return await http.getGrid<UserRoleGetGridDto>(`${this.baseUrl}Grid`, baseGrid);
	},
	async Delete(userId: number, roleId: number) {
		return await http.delete<boolean>(`${this.baseUrl}${userId}/${roleId}`);
	},
};

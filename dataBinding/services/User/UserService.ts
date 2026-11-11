import { GetUserDetail } from "@/dataBinding/models/User/GetUserDetail";
import { UserAddDto } from "@/dataBinding/models/User/UserAddDto";
import { UserChangePasswordDto } from "@/dataBinding/models/User/UserChangePasswordDto";
import { UserGetEditDto } from "@/dataBinding/models/User/UserGetEditDto";
import { UserGetGridDto } from "@/dataBinding/models/User/UserGetGridDto";
import { BaseGrid } from "@/utilities/models/Grid/base-grid.model";
import { http } from "@/utilities/services/http.service";
import { StaticsUrl } from "@/utilities/StaticsUrl";

export const UserService = {
	baseUrl: `${StaticsUrl.DevUrl}v1/User/`,

	async GetName(): Promise<GetUserDetail> {
		return await http.get<GetUserDetail>(`${this.baseUrl}GetProfileDetail`);
	},
	async GetEdit(id: number) {
		return await http.get<UserGetEditDto>(`${this.baseUrl}GetEdit/${id}`);
	},
	async GetGrid(baseGrid: BaseGrid) {
		return await http.getGrid<UserGetGridDto>(`${this.baseUrl}Grid`, baseGrid);
	},
	async Add(data: UserAddDto): Promise<boolean> {
		return await http.post<UserAddDto, boolean>(`${this.baseUrl}`, data);
	},
	async ChangePasswordAdmin(data: UserChangePasswordDto): Promise<boolean> {
		return await http.post<UserChangePasswordDto, boolean>(`${this.baseUrl}Password/AdminReset`, data);
	},
	async ChangePassword(data: UserChangePasswordDto): Promise<boolean> {
		return await http.post<UserChangePasswordDto, boolean>(`${this.baseUrl}Password`, data);
	},
};

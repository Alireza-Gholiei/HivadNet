import { RoleAddDto } from "@/dataBinding/models/Role/RoleAddDto";
import { RoleEditDto } from "@/dataBinding/models/Role/RoleEditDto";
import { RoleGetChildDto } from "@/dataBinding/models/Role/RoleGetChildDto";
import { RoleGetEditDto } from "@/dataBinding/models/Role/RoleGetEditDto";
import { RoleGetGridDto } from "@/dataBinding/models/Role/RoleGetGridDto";
import { RoleGetNameDto } from "@/dataBinding/models/Role/RoleGetNameDto";
import { BaseGrid } from "@/utilities/models/Grid/base-grid.model";
import { http } from "@/utilities/services/http.service";
import { StaticsUrl } from "@/utilities/StaticsUrl";

export const RoleService = {
	baseUrl: `${StaticsUrl.DevUrl}v1/Role/`,

	async Create(data: RoleAddDto): Promise<boolean> {
		return await http.post<RoleAddDto, boolean>(`${this.baseUrl}`, data);
	},
	async Update(data: RoleEditDto): Promise<boolean> {
		return await http.put<RoleEditDto, boolean>(`${this.baseUrl}`, data);
	},
	async GetRoleName(id: number): Promise<RoleGetNameDto> {
		return await http.get<RoleGetNameDto>(`${this.baseUrl}${id}`);
	},
	async GetEdit(id: number): Promise<RoleGetEditDto> {
		return await http.get<RoleGetEditDto>(`${this.baseUrl}${id}`);
	},
	async GetGrid(baseGrid: BaseGrid) {
		return await http.getGrid<RoleGetGridDto>(`${this.baseUrl}Grid`, baseGrid);
	},
	async GetChild(id: number): Promise<RoleGetChildDto[]> {
		if (id === 0) {
			return await http.get<RoleGetChildDto[]>(`${this.baseUrl}Child`);
		}
		return await http.get<RoleGetChildDto[]>(`${this.baseUrl}Child/${id}`);
	},
};

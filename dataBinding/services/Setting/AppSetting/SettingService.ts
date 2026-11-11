import {
	SettingAddDto,
	SettingEditDto,
	SettingGetByIdDto,
	SettingGetGridDto,
} from "@/dataBinding/models/Setting/AppSetting/SettingDtos";
import { BaseGrid } from "@/utilities/models/Grid/base-grid.model";
import { http } from "@/utilities/services/http.service";
import { StaticsUrl } from "@/utilities/StaticsUrl";

export const SettingService = {
	baseUrl: `${StaticsUrl.DevUrl}v1/Setting/`,

	async Add(data: SettingAddDto) {
		return await http.post<SettingAddDto, boolean>(`${this.baseUrl}`, data);
	},
	async Edit(data: SettingEditDto) {
		return await http.put<SettingEditDto, boolean>(`${this.baseUrl}`, data);
	},
	async GetById(id: number) {
		return await http.get<SettingGetByIdDto>(`${this.baseUrl}Get/${id}`);
	},
	async GetGrid(baseGrid: BaseGrid) {
		return await http.getGrid<SettingGetGridDto>(`${this.baseUrl}Get`, baseGrid);
	},
};

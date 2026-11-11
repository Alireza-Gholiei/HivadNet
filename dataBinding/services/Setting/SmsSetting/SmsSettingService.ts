import {
	SmsSettingAddDto,
	SmsSettingEditDto,
	SmsSettingGetByIdDto,
	SmsSettingGetGridDto,
	SmsSettingGetTypesDto,
} from "@/dataBinding/models/Setting/SmsSetting/SmsSettingDtos";
import { BaseGrid } from "@/utilities/models/Grid/base-grid.model";
import { http } from "@/utilities/services/http.service";
import { StaticsUrl } from "@/utilities/StaticsUrl";

export const SmsSettingService = {
	baseUrl: `${StaticsUrl.DevUrl}v1/SmsSetting/`,

	async Add(data: SmsSettingAddDto) {
		return await http.post<SmsSettingAddDto, boolean>(`${this.baseUrl}`, data);
	},
	async Edit(data: SmsSettingEditDto) {
		return await http.put<SmsSettingEditDto, boolean>(`${this.baseUrl}`, data);
	},
	async GetTypes() {
		return await http.get<SmsSettingGetTypesDto[]>(`${this.baseUrl}Get/Types`);
	},
	async GetById(id: number) {
		return await http.get<SmsSettingGetByIdDto>(`${this.baseUrl}Get/${id}`);
	},
	async GetGrid(baseGrid: BaseGrid) {
		return await http.getGrid<SmsSettingGetGridDto>(`${this.baseUrl}Get`, baseGrid);
	},
};

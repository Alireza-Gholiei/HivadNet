import {
	SmsAddByGuildDto,
	SmsAddCustomDto,
	SmsAddCustomersDto,
	SmsAddDto,
	SmsGetActiveListDto,
	SmsGetDetailsDto,
	SmsGetDetailsItemDto,
	SmsGetGridDto,
} from "@/dataBinding/models/Messaging/Sms/SmsDtos";
import { http } from "@/utilities/services/http.service";
import { StaticsUrl } from "@/utilities/StaticsUrl";

import { BaseGrid } from "./../../../../utilities/models/Grid/base-grid.model";

export const SmsService = {
	baseUrl: `${StaticsUrl.DevUrl}v1/Sms/`,

	async Add(data: SmsAddDto) {
		return await http.post<SmsAddDto, boolean>(`${this.baseUrl}`, data);
	},
	async ByGuild(data: SmsAddByGuildDto) {
		return await http.post<SmsAddByGuildDto, boolean>(`${this.baseUrl}ByGuild`, data);
	},
	async AddCustomer(data: SmsAddCustomersDto) {
		return await http.post<SmsAddCustomersDto, boolean>(`${this.baseUrl}Customer`, data);
	},
	async Custom(data: SmsAddCustomDto) {
		return await http.post<SmsAddCustomDto, boolean>(`${this.baseUrl}Custom`, data);
	},
	async GetGrid(baseGrid: BaseGrid) {
		return await http.getGrid<SmsGetGridDto>(`${this.baseUrl}Get`, baseGrid);
	},
	async GetDetail(smsGroupId: number) {
		return await http.get<SmsGetDetailsDto>(`${this.baseUrl}Get/${smsGroupId}`);
	},
	async GetDetailItem(smsGroupId: number, baseGrid: BaseGrid) {
		return await http.getGrid<SmsGetDetailsItemDto>(`${this.baseUrl}Get/${smsGroupId}/Item`, baseGrid);
	},
	async GetActiveList() {
		return await http.get<SmsGetActiveListDto[]>(`${this.baseUrl}Get/Active`);
	},
};

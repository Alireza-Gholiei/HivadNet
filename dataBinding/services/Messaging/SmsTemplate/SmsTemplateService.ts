import {
	SmsTemplateAddDto,
	SmsTemplateEditDto,
	SmsTemplateGetByIdDto,
	SmsTemplateGetGridDto,
	SmsTemplateGetPreviewDto,
	SmsTemplateGetToUseDto,
	SmsTemplateRequestPreviewDto,
	SmsTemplateVariableDto,
} from "@/dataBinding/models/Messaging/SmsTemplate/SmsTemplateDtos";
import { http } from "@/utilities/services/http.service";
import { StaticsUrl } from "@/utilities/StaticsUrl";

import { BaseGrid } from "./../../../../utilities/models/Grid/base-grid.model";

export const SmsTemplateService = {
	baseUrl: `${StaticsUrl.DevUrl}v1/SmsTemplate/`,

	async Add(data: SmsTemplateAddDto) {
		return await http.post<SmsTemplateAddDto, boolean>(`${this.baseUrl}`, data);
	},
	async Edit(data: SmsTemplateEditDto) {
		return await http.put<SmsTemplateEditDto, boolean>(`${this.baseUrl}`, data);
	},
	async GetVariables() {
		return await http.get<SmsTemplateVariableDto[]>(`${this.baseUrl}Variable`);
	},
	async GetById(id: number) {
		return await http.get<SmsTemplateGetByIdDto>(`${this.baseUrl}Get/${id}`);
	},
	async GetGrid(baseGrid: BaseGrid) {
		return await http.getGrid<SmsTemplateGetGridDto>(`${this.baseUrl}Get`, baseGrid);
	},
	async Preview(data: SmsTemplateRequestPreviewDto) {
		return await http.post<SmsTemplateRequestPreviewDto, SmsTemplateGetPreviewDto>(`${this.baseUrl}Preview`, data);
	},
	async GetTemplateToUse(id: number) {
		return await http.get<SmsTemplateGetToUseDto>(`${this.baseUrl}Get/ToUse/${id}`);
	},
};

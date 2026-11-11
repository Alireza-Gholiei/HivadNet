import { ServiceAddDto } from "@/dataBinding/models/Service/ServiceAddDto";
import { ServiceEditDto } from "@/dataBinding/models/Service/ServiceEditDto";
import { ServiceGetByIdDto } from "@/dataBinding/models/Service/ServiceGetByIdDto";
import { ServiceGetDetailDto } from "@/dataBinding/models/Service/ServiceGetDetailDto";
import { ServiceGetGridDto } from "@/dataBinding/models/Service/ServiceGetGridDto";
import { ServiceGetLastDto } from "@/dataBinding/models/Service/ServiceGetLastDto";
import { ServiceIncomeReportDto, ServiceIncomeReportQry } from "@/dataBinding/models/Service/ServiceIncomeReportDto";
import { ServicePaymentDto } from "@/dataBinding/models/Service/ServicePaymentDto";
import { BaseGrid, GridData } from "@/utilities/models/Grid/base-grid.model";
import { http } from "@/utilities/services/http.service";
import { StaticsUrl } from "@/utilities/StaticsUrl";

export const ServiceService = {
	baseUrl: `${StaticsUrl.DevUrl}v1/Service/`,

	async Add(data: ServiceAddDto): Promise<number> {
		return await http.post<ServiceAddDto, number>(`${this.baseUrl}`, data);
	},
	async Edit(data: ServiceEditDto): Promise<{ ServiceId: number; AmountDifference: number }> {
		return await http.put<ServiceEditDto, { ServiceId: number; AmountDifference: number }>(`${this.baseUrl}`, data);
	},
	async Payment(data: ServicePaymentDto): Promise<boolean> {
		return await http.post<ServicePaymentDto, boolean>(`${this.baseUrl}Payment`, data);
	},
	async GetGrid(baseGrid: BaseGrid, customerId: number): Promise<GridData<ServiceGetGridDto>> {
		return await http.getGrid<ServiceGetGridDto>(`${this.baseUrl}GetGrid/${customerId}`, baseGrid);
	},
	async GetGridAll(baseGrid: BaseGrid): Promise<GridData<ServiceGetGridDto>> {
		return await http.getGrid<ServiceGetGridDto>(`${this.baseUrl}GetGrid`, baseGrid);
	},
	async GetDetail(id: number): Promise<ServiceGetDetailDto> {
		return await http.get<ServiceGetDetailDto>(`${this.baseUrl}Detail/${id}`);
	},
	async GetById(id: number): Promise<ServiceGetByIdDto> {
		return await http.get<ServiceGetByIdDto>(`${this.baseUrl}${id}`);
	},
	async GetLast(customerId: number): Promise<ServiceGetLastDto> {
		return await http.get<ServiceGetLastDto>(`${this.baseUrl}GetLast/${customerId}`);
	},
	async getServiceIncomeReport(query: ServiceIncomeReportQry) {
		const params = buildIncomeReportQueryParams(query);
		const resultParams = params.toString();
		return await http.get<ServiceIncomeReportDto[]>(`${this.baseUrl}Report/Income?${resultParams}`);
	},
};

function buildIncomeReportQueryParams(query?: ServiceIncomeReportQry) {
	const params = new URLSearchParams();

	params.set("Aggregation", String(query?.Aggregation ?? 2));

	if (query?.FromDate) {
		params.set("FromDate", toApiDate(query.FromDate));
	}

	if (query?.ToDate) {
		params.set("ToDate", toApiDate(query.ToDate));
	}

	if ((query?.CustomerId ?? 0) > 0) {
		params.set("CustomerId", String(query!.CustomerId));
	}

	if ((query?.GuildId ?? 0) > 0) {
		params.set("GuildId", String(query!.GuildId));
	}

	if ((query?.GuildGroupId ?? 0) > 0) {
		params.set("GuildGroupId", String(query!.GuildGroupId));
	}

	return params.toString();
}

function toApiDate(value: string | Date) {
	if (value instanceof Date) {
		return value.toISOString();
	}

	return value;
}

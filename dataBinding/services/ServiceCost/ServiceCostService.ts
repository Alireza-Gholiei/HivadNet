import { ServiceCostAddDto } from "@/dataBinding/models/ServiceCost/ServiceCostAddDto";
import { ServiceCostEditDto } from "@/dataBinding/models/ServiceCost/ServiceCostEditDto";
import { ServiceCostGetByGuildIdDto } from "@/dataBinding/models/ServiceCost/ServiceCostGetByGuildIdDto";
import { ServiceCostGetByIdDto } from "@/dataBinding/models/ServiceCost/ServiceCostGetByIdDto";
import { ServiceCostGetGuildIdDto } from "@/dataBinding/models/ServiceCost/ServiceCostGetGuildIdDto";
import { BaseGrid, GridData } from "@/utilities/models/Grid/base-grid.model";
import { http } from "@/utilities/services/http.service";
import { StaticsUrl } from "@/utilities/StaticsUrl";

export const ServiceCostService = {
	baseUrl: `${StaticsUrl.DevUrl}v1/ServiceCost/`,

	async ServiceCost(data: ServiceCostAddDto): Promise<boolean> {
		return await http.post<ServiceCostAddDto, boolean>(`${this.baseUrl}`, data);
	},
	async Get(baseGrid: BaseGrid, Id: number): Promise<GridData<ServiceCostGetGuildIdDto>> {
		return await http.getGrid<ServiceCostGetGuildIdDto>(`${this.baseUrl}${Id}`, baseGrid);
	},
	async GetById(Id: number): Promise<ServiceCostGetByIdDto> {
		return await http.get<ServiceCostGetByIdDto>(`${this.baseUrl}Get/${Id}`);
	},
	async GetByGuildId(GuildId: number): Promise<ServiceCostGetByGuildIdDto[]> {
		return await http.get<ServiceCostGetByGuildIdDto[]>(`${this.baseUrl}GetList/${GuildId}`);
	},
	async Edit(Data: ServiceCostEditDto): Promise<boolean> {
		return await http.put<ServiceCostEditDto, boolean>(`${this.baseUrl}`, Data);
	},
};

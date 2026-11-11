import { GuildAddDto } from "@/dataBinding/models/Guild/GuildAddDto";
import { GuildEditDto } from "@/dataBinding/models/Guild/GuildEditDto";
import { GuildGetByIdDto } from "@/dataBinding/models/Guild/GuildGetByIdDto";
import { GuildGetCustomerGuildList } from "@/dataBinding/models/Guild/GuildGetCustomerGuildList";
import { GuildGetFieldsDto } from "@/dataBinding/models/Guild/GuildGetFieldsDto";
import { GuildGetGridDto } from "@/dataBinding/models/Guild/GuildGetGridDto";
import { GuildGetListDto } from "@/dataBinding/models/Guild/GuildGetListDto";
import { BaseGrid, GridData } from "@/utilities/models/Grid/base-grid.model";
import { http } from "@/utilities/services/http.service";
import { StaticsUrl } from "@/utilities/StaticsUrl";

export const GuildService = {
	baseUrl: `${StaticsUrl.DevUrl}v1/Guild/`,

	async Add(Guild: GuildAddDto): Promise<boolean> {
		return await http.post<GuildAddDto, boolean>(`${this.baseUrl}`, Guild);
	},
	async Edit(Guild: GuildEditDto): Promise<boolean> {
		return await http.put<GuildEditDto, boolean>(`${this.baseUrl}`, Guild);
	},
	async GetGrid(baseGrid: BaseGrid): Promise<GridData<GuildGetGridDto>> {
		return await http.getGrid<GuildGetGridDto>(`${this.baseUrl}GetGrid`, baseGrid);
	},
	async GetList(): Promise<GuildGetListDto[]> {
		return await http.get<GuildGetListDto[]>(`${this.baseUrl}GetList`);
	},
	async GetById(Id: number): Promise<GuildGetByIdDto> {
		return await http.get<GuildGetByIdDto>(`${this.baseUrl}${Id}`);
	},
	async GetFields(Id: number): Promise<GuildGetFieldsDto[]> {
		return await http.get<GuildGetFieldsDto[]>(`${this.baseUrl}Fields/${Id}`);
	},
	async GetCustomerGuildList(customerId: number): Promise<GuildGetCustomerGuildList[]> {
		return await http.get<GuildGetCustomerGuildList[]>(`${this.baseUrl}Customer/${customerId}`);
	},
};

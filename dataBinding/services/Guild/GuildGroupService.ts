import { GuildGroupAddCustomerDto } from "@/dataBinding/models/Guild/GuildGroup/GuildGroupAddCustomerDto";
import { GuildGroupAddDto } from "@/dataBinding/models/Guild/GuildGroup/GuildGroupAddDto";
import { GuildGroupEditDto } from "@/dataBinding/models/Guild/GuildGroup/GuildGroupEditDto";
import { GuildGroupGetByIdDto } from "@/dataBinding/models/Guild/GuildGroup/GuildGroupGetByIdDto";
import { GuildGroupGetCustomerGuildGroupListDto } from "@/dataBinding/models/Guild/GuildGroup/GuildGroupGetCustomerGuildGroupListDto";
import { GuildGroupGetFieldDto } from "@/dataBinding/models/Guild/GuildGroup/GuildGroupGetFieldDto";
import { GuildGroupGetFieldTypesDto } from "@/dataBinding/models/Guild/GuildGroup/GuildGroupGetFieldTypesDto";
import { GuildGroupGetGridDto } from "@/dataBinding/models/Guild/GuildGroup/GuildGroupGetGridDto";
import { GuildGroupGetListDto } from "@/dataBinding/models/Guild/GuildGroup/GuildGroupGetListDto";
import { GuildGroupGetReminderTypesDto } from "@/dataBinding/models/Guild/GuildGroup/GuildGroupGetReminderTypesDto";
import { BaseGrid, GridData } from "@/utilities/models/Grid/base-grid.model";
import { http } from "@/utilities/services/http.service";
import { StaticsUrl } from "@/utilities/StaticsUrl";

export const GuildGroupService = {
	baseUrl: `${StaticsUrl.DevUrl}v1/GuildGroup/`,

	async Add(data: GuildGroupAddDto): Promise<boolean> {
		return await http.post<GuildGroupAddDto, boolean>(`${this.baseUrl}`, data);
	},
	async Edit(data: GuildGroupEditDto): Promise<boolean> {
		return await http.put<GuildGroupEditDto, boolean>(`${this.baseUrl}`, data);
	},
	async AddCustomer(data: GuildGroupAddCustomerDto): Promise<boolean> {
		return await http.post<GuildGroupAddCustomerDto, boolean>(`${this.baseUrl}Customer`, data);
	},
	async EditCustomer(data: GuildGroupAddCustomerDto): Promise<boolean> {
		return await http.put<GuildGroupAddCustomerDto, boolean>(`${this.baseUrl}Customer`, data);
	},
	async GetGrid(baseGrid: BaseGrid, guildId: number): Promise<GridData<GuildGroupGetGridDto>> {
		return await http.getGrid<GuildGroupGetGridDto>(`${this.baseUrl}GetGrid/${guildId}`, baseGrid);
	},
	async GetList(guildId: number): Promise<GuildGroupGetListDto[]> {
		return await http.get<GuildGroupGetListDto[]>(`${this.baseUrl}GetList/${guildId}`);
	},
	async GetById(Id: number): Promise<GuildGroupGetByIdDto> {
		return await http.get<GuildGroupGetByIdDto>(`${this.baseUrl}${Id}`);
	},
	async GetCustomer(customerId: number): Promise<GuildGroupGetListDto[]> {
		return await http.get<GuildGroupGetListDto[]>(`${this.baseUrl}Customer/${customerId}`);
	},
	async GetFieldTypes(): Promise<GuildGroupGetFieldTypesDto[]> {
		return await http.get<GuildGroupGetFieldTypesDto[]>(`${this.baseUrl}FieldTypes`);
	},
	async GetReminderTypes(): Promise<GuildGroupGetReminderTypesDto[]> {
		return await http.get<GuildGroupGetReminderTypesDto[]>(`${this.baseUrl}ReminderTypes`);
	},
	async GetField(Id: number): Promise<GuildGroupGetFieldDto[]> {
		return await http.get<GuildGroupGetFieldDto[]>(`${this.baseUrl}Fields/${Id}`);
	},
	async GetCustomerGuildGroupList(guildId: number, customerId: number) {
		return await http.get<GuildGroupGetCustomerGuildGroupListDto[]>(
			`${this.baseUrl}Customer/${customerId}/${guildId}`,
		);
	},
	async GetCustomerGuildGroupListForServiceEdit(customerId: number, guildId: number, serviceId: number) {
		return await http.get<GuildGroupGetCustomerGuildGroupListDto[]>(
			`${this.baseUrl}Customer/${customerId}/${guildId}/${serviceId}`,
		);
	},
};

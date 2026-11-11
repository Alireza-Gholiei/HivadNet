import { CustomerAddDto } from "@/dataBinding/models/Customer/CustomerAddDto";
import { CustomerAddWithRepresentativeDto } from "@/dataBinding/models/Customer/CustomerAddWithRepresentativeDto";
import { CustomerGetDetailDto } from "@/dataBinding/models/Customer/CustomerDetailsDto";
import { CustomerEditDto } from "@/dataBinding/models/Customer/CustomerEditDto";
import { CustomerGetEditDto } from "@/dataBinding/models/Customer/CustomerGetEditDto";
import { CustomerGetGridDto } from "@/dataBinding/models/Customer/CustomerGetGridDto";
import { CustomerGetGuildsDto } from "@/dataBinding/models/Customer/CustomerGetGuildGroupDetailDto";
import { CustomerGetRepresentativeDto } from "@/dataBinding/models/Customer/CustomerGetRepresentativeDto";
import { CustomerGetTypesDto } from "@/dataBinding/models/Customer/CustomerGetTypesDto";
import { CustomerRepresentativeAddByIdDto } from "@/dataBinding/models/Customer/CustomerRepresentativeAddByIdDto";
import { BaseGrid, GridData } from "@/utilities/models/Grid/base-grid.model";
import { http } from "@/utilities/services/http.service";
import { StaticsUrl } from "@/utilities/StaticsUrl";

import { CustomerAddRepresentativeDto } from "../../models/Customer/CustomerAddRepresentativeDto";
import { CustomerAddCardDto } from "@/dataBinding/models/Customer/Card/CustomerAddCardDto";
import { CustomerBankCardDto } from "@/dataBinding/models/Customer/Card/CustomerBankCardDto";

export const CustomerService = {
	baseUrl: `${StaticsUrl.DevUrl}v1/Customer/`,

	async Add(data: CustomerAddDto): Promise<boolean> {
		return await http.post<CustomerAddDto, boolean>(`${this.baseUrl}Add`, data);
	},
	async GetEdit(id: number): Promise<CustomerGetEditDto> {
		return await http.get<CustomerGetEditDto>(`${this.baseUrl}${id}`);
	},
	async GetRepresentative(customerId: number, guildGropId: number): Promise<CustomerGetRepresentativeDto[]> {
		return await http.get<CustomerGetRepresentativeDto[]>(
			`${this.baseUrl}Representative/${customerId}/${guildGropId}`,
		);
	},
	async Edit(data: CustomerEditDto): Promise<boolean> {
		return await http.put<CustomerEditDto, boolean>(`${this.baseUrl}Edit`, data);
	},
	async Get(baseGrid: BaseGrid): Promise<GridData<CustomerGetGridDto>> {
		return await http.getGrid<CustomerGetGridDto>(`${this.baseUrl}GetGrid`, baseGrid);
	},
	async GetDetails(id: number): Promise<CustomerGetDetailDto> {
		return await http.get<CustomerGetDetailDto>(`${this.baseUrl}Detail/${id}`);
	},
	async GetGuildGroupDetail(customerId: number, guildGroupId: number): Promise<CustomerGetGuildsDto> {
		return await http.get<CustomerGetGuildsDto>(`${this.baseUrl}Guild/${customerId}/${guildGroupId}`);
	},
	async AddRepresentative(data: CustomerAddRepresentativeDto): Promise<boolean> {
		return await http.post<CustomerAddRepresentativeDto, boolean>(`${this.baseUrl}Representative/Add`, data);
	},
	async AddWithRepresentative(data: CustomerAddWithRepresentativeDto): Promise<boolean> {
		return await http.post<CustomerAddWithRepresentativeDto, boolean>(
			`${this.baseUrl}Representative/BothAdd`,
			data,
		);
	},
	async RepresentativeAddById(data: CustomerRepresentativeAddByIdDto): Promise<boolean> {
		return await http.post<CustomerRepresentativeAddByIdDto, boolean>(
			`${this.baseUrl}Representative/AddById`,
			data,
		);
	},
	async GetTypes() {
		return await http.get<CustomerGetTypesDto[]>(`${this.baseUrl}Types`);
	},

	async AddCard(model: CustomerAddCardDto) {
		return await http.post<CustomerAddCardDto, boolean>(`${this.baseUrl}Card/Add`, model);
	},

	async RemoveCard(customerId: number, cardId: number) {
		return await http.delete<boolean>(`${this.baseUrl}Card/${customerId}/${cardId}`);
	},

	async GetCards(customerId: number) {
		return await http.get<CustomerBankCardDto[]>(`${this.baseUrl}Card/${customerId}`);
	},
};

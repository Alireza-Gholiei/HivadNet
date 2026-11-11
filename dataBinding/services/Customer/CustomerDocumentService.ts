import { CustomerDocumentAddDto } from "@/dataBinding/models/Customer/Document/CustomerDocumentAddDto";
import { CustomerDocumentGetGridDto } from "@/dataBinding/models/Customer/Document/CustomerDocumentGetGridDto";
import { BaseGrid, GridData } from "@/utilities/models/Grid/base-grid.model";
import { http } from "@/utilities/services/http.service";
import { StaticsUrl } from "@/utilities/StaticsUrl";

export const CustomerDocumentService = {
	baseUrl: `${StaticsUrl.DevUrl}v1/CustomerDocument/`,

	async Add(data: CustomerDocumentAddDto): Promise<boolean> {
		return await http.postFormAsync<CustomerDocumentAddDto, boolean>(`${this.baseUrl}`, data);
	},
	async GetGrid(baseGrid: BaseGrid, customerId: number): Promise<GridData<CustomerDocumentGetGridDto>> {
		return await http.getGrid<CustomerDocumentGetGridDto>(`${this.baseUrl}GetGrid/${customerId}`, baseGrid);
	},
	async Delete(id: number): Promise<boolean> {
		return await http.delete<boolean>(`${this.baseUrl}${id}`);
	},
};

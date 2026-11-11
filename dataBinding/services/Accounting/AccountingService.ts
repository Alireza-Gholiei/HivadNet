import { CustomerBalanceDto } from "@/dataBinding/models/Accounting/CustomerBalanceDto";
import { CustomerEntryDto } from "@/dataBinding/models/Accounting/CustomerEntryDto";
import { CustomerJournalLineDto } from "@/dataBinding/models/Accounting/CustomerJournalLineDto";
import { JournalEntryAddManualDto } from "@/dataBinding/models/Accounting/JournalEntryAddManualDto";
import { PaymentMethodDto } from "@/dataBinding/models/Accounting/PaymentMethodDto";
import { BaseGrid, GridData } from "@/utilities/models/Grid/base-grid.model";
import { http } from "@/utilities/services/http.service";
import { StaticsUrl } from "@/utilities/StaticsUrl";

export const AccountingService = {
	baseUrl: `${StaticsUrl.DevUrl}v1/Accounting/`,

	async Add(data: JournalEntryAddManualDto) {
		return await http.post<JournalEntryAddManualDto, boolean>(`${this.baseUrl}JournalEntry/Manual`, data);
	},

	async AddCustomerInvoice(data: CustomerEntryDto) {
		return await http.post<CustomerEntryDto, boolean>(`${this.baseUrl}JournalEntry/CustomerInvoice`, data);
	},

	async getCustomersBalanceGrid(baseGrid: BaseGrid): Promise<GridData<CustomerBalanceDto>> {
		return await http.getGrid<CustomerBalanceDto>(`${this.baseUrl}Customer`, baseGrid);
	},

	async getCustomerBalance(customerId: number) {
		return await http.get<number>(`${this.baseUrl}Customer/${customerId}/Balance`);
	},

	async getCustomerJournalLinesGrid(customerId: number, baseGrid: BaseGrid) {
		return await http.getGrid<CustomerJournalLineDto>(`${this.baseUrl}Customer/${customerId}/Lines`, baseGrid);
	},

	async getPaymentMethods() {
		return await http.get<PaymentMethodDto[]>(`${this.baseUrl}PaymentMethods`);
	},
};

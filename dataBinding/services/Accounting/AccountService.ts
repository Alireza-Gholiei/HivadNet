import { AccountTreeDto } from "@/dataBinding/models/Accounting/Account/AccountTreeDto";
import { http } from "@/utilities/services/http.service";
import { StaticsUrl } from "@/utilities/StaticsUrl";

export const AccountService = {
	baseUrl: `${StaticsUrl.DevUrl}v1/Account/`,

	async GetAccountTree() {
		return await http.get<AccountTreeDto[]>(`${this.baseUrl}Tree`);
	},
};

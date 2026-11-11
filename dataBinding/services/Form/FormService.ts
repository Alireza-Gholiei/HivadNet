import { FormGetChildDto } from "@/dataBinding/models/Form/FormGetChildDto";
import { FormMenuDto } from "@/dataBinding/models/Form/FormMenuDto";
import { http } from "@/utilities/services/http.service";
import { StaticsUrl } from "@/utilities/StaticsUrl";

export const FormService = {
	baseUrl: `${StaticsUrl.DevUrl}v1/Form/`,

	async GetChild(id: number): Promise<FormGetChildDto[]> {
		if (id === 0) {
			return await http.get<FormGetChildDto[]>(`${this.baseUrl}GetChild`);
		}
		return await http.get<FormGetChildDto[]>(`${this.baseUrl}GetChild/${id}`);
	},
	async GetMenu() {
		return await http.get<FormMenuDto[]>(`${this.baseUrl}GetMenu`);
	},
};

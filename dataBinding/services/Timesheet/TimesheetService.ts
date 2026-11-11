import { TimesheetGet } from "@/dataBinding/models/Timesheet/TimesheetGet";
import { TimesheetGetById } from "@/dataBinding/models/Timesheet/TimesheetGetById";
import { BaseGrid, GridData } from "@/utilities/models/Grid/base-grid.model";
import { http } from "@/utilities/services/http.service";
import { StaticsUrl } from "@/utilities/StaticsUrl";

export const TimesheetService = {
	baseUrl: `${StaticsUrl.DevUrl}v1/Timesheet/`,

	async Get(baseGrid: BaseGrid): Promise<GridData<TimesheetGet>> {
		return await http.getGrid<TimesheetGet>(`${this.baseUrl}Grid`, baseGrid);
	},
	async GetById(id: number, baseGrid: BaseGrid): Promise<GridData<TimesheetGetById>> {
		return await http.getGrid<TimesheetGetById>(`${this.baseUrl}Grid/${id}`, baseGrid);
	},
	async RegisterEntry() {
		return await http.post<{}, boolean>(`${this.baseUrl}Entry`, {});
	},
	async RegisterExit() {
		return await http.post<{}, boolean>(`${this.baseUrl}Exit`, {});
	},
};

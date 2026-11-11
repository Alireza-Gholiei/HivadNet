import { ReminderAddDto } from "@/dataBinding/models/Reminder/ReminderAddDto";
import { ReminderGetByUserDto } from "@/dataBinding/models/Reminder/ReminderGetByUserDto";
import { ReminderGetGridDto } from "@/dataBinding/models/Reminder/ReminderGetGridDto";
import { ReminderTypeDto } from "@/dataBinding/models/Reminder/ReminderTypeDto";
import { BaseGrid, GridData } from "@/utilities/models/Grid/base-grid.model";
import { http } from "@/utilities/services/http.service";
import { StaticsUrl } from "@/utilities/StaticsUrl";

export const ReminderService = {
	baseUrl: `${StaticsUrl.DevUrl}v1/Reminder/`,

	async ReminderAdd(data: ReminderAddDto): Promise<boolean> {
		return await http.post<ReminderAddDto, boolean>(`${this.baseUrl}`, data);
	},
	async Get(baseGrid: BaseGrid): Promise<GridData<ReminderGetGridDto>> {
		return await http.getGrid<ReminderGetGridDto>(`${this.baseUrl}Get/Grid`, baseGrid);
	},
	async GetMe(baseGrid: BaseGrid): Promise<GridData<ReminderGetGridDto>> {
		return await http.getGrid<ReminderGetGridDto>(`${this.baseUrl}Get/User`, baseGrid);
	},
	async GetByUser() {
		return await http.get<ReminderGetByUserDto[]>(`${this.baseUrl}User`);
	},
	async AssignToUser(data: { reminderId: number; userId: number }) {
		return await http.patch<number, boolean>(`${this.baseUrl}User/${data.reminderId}`, data.userId);
	},
	async Complete(id: number): Promise<boolean> {
		return await http.patch<number, boolean>(`${this.baseUrl}${id}`);
	},
	async Types() {
		return await http.get<ReminderTypeDto[]>(`${this.baseUrl}Types`);
	},
};

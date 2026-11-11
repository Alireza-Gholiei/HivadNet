import { ArchiveFolderAddCmd } from "@/dataBinding/models/Archive/ArchiveFolder/ArchiveFolderAddCmd";
import { ArchiveFolderMoveCmd } from "@/dataBinding/models/Archive/ArchiveFolder/ArchiveFolderMoveCmd";
import { ArchiveFolderRenameCmd } from "@/dataBinding/models/Archive/ArchiveFolder/ArchiveFolderRenameCmd";
import { ArchiveFolderTreeDto } from "@/dataBinding/models/Archive/ArchiveFolder/ArchiveFolderTreeDto";
import { http } from "@/utilities/services/http.service";
import { StaticsUrl } from "@/utilities/StaticsUrl";

export const ArchiveFolderService = {
	baseUrl: `${StaticsUrl.DevUrl}v1/ArchiveFolder/`,

	async Add(data: ArchiveFolderAddCmd): Promise<boolean> {
		return await http.post<ArchiveFolderAddCmd, boolean>(`${this.baseUrl}`, data);
	},
	async Rename(data: ArchiveFolderRenameCmd): Promise<boolean> {
		return await http.put<ArchiveFolderRenameCmd, boolean>(`${this.baseUrl}Rename`, data);
	},
	async Move(data: ArchiveFolderMoveCmd): Promise<boolean> {
		return await http.put<ArchiveFolderMoveCmd, boolean>(`${this.baseUrl}Move`, data);
	},
	async GetTree(): Promise<ArchiveFolderTreeDto[]> {
		return await http.get<ArchiveFolderTreeDto[]>(`${this.baseUrl}Tree`);
	},
};

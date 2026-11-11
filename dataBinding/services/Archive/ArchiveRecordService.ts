import { ArchiveDocumentDetailDto } from "@/dataBinding/models/Archive/ArchiveRecord/ArchiveDocumentDetailDto";
import { ArchiveDocumentUpdateContentCmd } from "@/dataBinding/models/Archive/ArchiveRecord/ArchiveDocumentUpdateContentCmd";
import { ArchiveRecordAddDocumentCmd } from "@/dataBinding/models/Archive/ArchiveRecord/ArchiveRecordAddDocumentCmd";
import { ArchiveRecordAddFileCmd } from "@/dataBinding/models/Archive/ArchiveRecord/ArchiveRecordAddFileCmd";
import { ArchiveRecordArchiveCmd } from "@/dataBinding/models/Archive/ArchiveRecord/ArchiveRecordArchiveCmd";
import { ArchiveRecordGetGridDto } from "@/dataBinding/models/Archive/ArchiveRecord/ArchiveRecordGetGridDto";
import { ArchiveRecordMoveCmd } from "@/dataBinding/models/Archive/ArchiveRecord/ArchiveRecordMoveCmd";
import { ArchiveRecordRenameCmd } from "@/dataBinding/models/Archive/ArchiveRecord/ArchiveRecordRenameCmd";
import { BaseGrid, GridData } from "@/utilities/models/Grid/base-grid.model";
import { http } from "@/utilities/services/http.service";
import { StaticsUrl } from "@/utilities/StaticsUrl";

export const ArchiveRecordService = {
	baseUrl: `${StaticsUrl.DevUrl}v1/ArchiveRecord/`,

	async AddDocument(data: ArchiveRecordAddDocumentCmd): Promise<boolean> {
		return await http.post<ArchiveRecordAddDocumentCmd, boolean>(`${this.baseUrl}Document`, data);
	},
	async AddFile(data: ArchiveRecordAddFileCmd): Promise<boolean> {
		return await http.postFormAsync<ArchiveRecordAddFileCmd, boolean>(`${this.baseUrl}File`, data);
	},
	async UpdateDocumentContent(data: ArchiveDocumentUpdateContentCmd): Promise<boolean> {
		return await http.put<ArchiveDocumentUpdateContentCmd, boolean>(`${this.baseUrl}Document/Content`, data);
	},
	async Rename(data: ArchiveRecordRenameCmd): Promise<boolean> {
		return await http.put<ArchiveRecordRenameCmd, boolean>(`${this.baseUrl}Rename`, data);
	},
	async Move(data: ArchiveRecordMoveCmd): Promise<boolean> {
		return await http.put<ArchiveRecordMoveCmd, boolean>(`${this.baseUrl}Move`, data);
	},
	async Archive(data: ArchiveRecordArchiveCmd): Promise<boolean> {
		return await http.put<ArchiveRecordArchiveCmd, boolean>(`${this.baseUrl}Archive`, data);
	},
	async GetGrid(baseGrid: BaseGrid, folderId?: number): Promise<GridData<ArchiveRecordGetGridDto>> {
		const folderPath = folderId ? `${folderId}` : "";
		return await http.getGrid<ArchiveRecordGetGridDto>(`${this.baseUrl}GetGrid/${folderPath}`, baseGrid);
	},
	async GetDocumentDetail(id: number): Promise<ArchiveDocumentDetailDto> {
		return await http.get<ArchiveDocumentDetailDto>(`${this.baseUrl}Document/Detail/${id}`);
	},
};

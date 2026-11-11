import { FilesAddResultDto } from "@/dataBinding/models/Documents/FilesAddResultDto";
import { http } from "@/utilities/services/http.service";
import { StaticsUrl } from "@/utilities/StaticsUrl";

export const FilesService = {
	baseUrl: `${StaticsUrl.DevUrl}v1/Files/`,

	async Upload(file: File): Promise<FilesAddResultDto> {
		return await http.uploadFile<FilesAddResultDto>(`${this.baseUrl}`, file);
	},
	async UploadForChat(file: File): Promise<FilesAddResultDto> {
		return await http.uploadFile<FilesAddResultDto>(`${this.baseUrl}Chat`, file);
	},
	async Download(fileName: string) {
		await http.downloadFile(`${this.baseUrl}Download/${fileName}`, fileName);
	},
};

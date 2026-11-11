import { AxiosRequestConfig } from "axios";

import { errorHandle } from "../Extentions/ErrorHandller";
import type { ApiResult, ApiResultWithData } from "../models/api-result.model";
import { BaseGrid, GridData } from "../models/Grid/base-grid.model";
import api from "./http.interceptor";

class HttpService {
	async get<TOut>(url: string): Promise<TOut> {
		return this.send<TOut>({ method: "GET", url });
	}

	async getGrid<TOut>(url: string, grid: BaseGrid): Promise<GridData<TOut>> {
		const query = encodeURIComponent(JSON.stringify(grid));
		const fullUrl = `${url}?Grid=${query}`;
		return this.send<GridData<TOut>>({ method: "GET", url: fullUrl });
	}

	async post<TIn, TOut>(url: string, data: TIn): Promise<TOut> {
		return this.send<TOut>({ method: "POST", url, data });
	}

	postFormAsync = async <TIn, TOut>(url: string, data: TIn): Promise<TOut> => {
		const formData = this.buildFormData(data);

		const headers: Record<string, string> = {
			"Content-Type": "multipart/form-data",
		};

		return this.send<TOut>({
			method: "POST",
			url,
			data: formData,
			headers,
		});
	};

	async put<TIn, TOut>(url: string, data: TIn): Promise<TOut> {
		return this.send<TOut>({ method: "PUT", url, data });
	}

	putFormAsync = async <TIn, TOut>(url: string, data: TIn): Promise<TOut> => {
		const formData = this.buildFormData(data);

		const headers: Record<string, string> = {
			"Content-Type": "multipart/form-data",
		};

		return this.send<TOut>({
			method: "PUT",
			url,
			data: formData,
			headers,
		});
	};

	async patch<TIn, TOut>(url: string, data?: TIn): Promise<TOut> {
		return this.send<TOut>({
			method: "PATCH",
			url,
			data,
			headers: { "Content-Type": "application/json-patch+json" },
		});
	}

	async delete<TOut>(url: string): Promise<TOut> {
		return this.send<TOut>({ method: "DELETE", url });
	}

	async uploadFile<TOut>(url: string, file: File): Promise<TOut> {
		const formData = new FormData();
		formData.append("File", file);

		return this.send<TOut>({
			url,
			method: "POST",
			data: formData,
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	}

	async downloadFile(url: string, fileName: string): Promise<void> {
		const response = await this.send<any>({ url, method: "GET", responseType: "blob" }, false, false);

		const blob = new Blob([response.data]);

		const contentDisposition = response.headers["content-disposition"];

		if (contentDisposition) {
			const fileNameMatch = contentDisposition.match(/filename\*=UTF-8''(.+)|filename="?([^"]+)"?/);

			if (fileNameMatch) {
				fileName = decodeURIComponent(fileNameMatch[1] || fileNameMatch[2]);
			}
		}

		const urlFile = window.URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.href = urlFile;
		link.download = fileName;
		document.body.appendChild(link);
		link.click();

		link.remove();
		window.URL.revokeObjectURL(urlFile);
	}

	private async send<TOut>(
		config: AxiosRequestConfig,
		isApiResult: boolean = true,
		isTOut: boolean = true,
	): Promise<TOut> {
		try {
			const normalizedConfig: AxiosRequestConfig = {
				...config,
				data: config.data instanceof FormData ? config.data : this.serializeDatesForApi(config.data),
			};

			const response = await api.request(normalizedConfig);

			if (isApiResult) {
				const responseResult = response.data as ApiResult;

				if (!responseResult.IsSuccess) {
					errorHandle(responseResult);
					return null as any;
				}
				if (isTOut) {
					const apiResult = response.data as ApiResultWithData<TOut>;
					return apiResult.Data ?? (null as any);
				} else {
					return response as any;
				}
			} else {
				if (isTOut) {
					return response.data as TOut;
				} else {
					return response as any;
				}
			}
		} catch (error) {
			errorHandle(error);
			return null as any;
		}
	}

	private serializeDatesForApi = (value: any): any => {
		if (value === null || value === undefined) return value;

		if (value instanceof Date) {
			return this.toLocalDateTimeWithoutZone(value);
		}

		if (value instanceof FormData || value instanceof File || value instanceof Blob) {
			return value;
		}

		if (Array.isArray(value)) {
			return value.map((item) => this.serializeDatesForApi(item));
		}

		if (typeof value === "object") {
			const result: any = {};

			Object.keys(value).forEach((key) => {
				result[key] = this.serializeDatesForApi(value[key]);
			});

			return result;
		}

		return value;
	};

	private toLocalDateTimeWithoutZone = (date: Date): string => {
		const pad = (n: number) => String(n).padStart(2, "0");

		return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
			date.getHours(),
		)}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
	};

	buildFormData = (
		obj: any,
		formData: FormData = new FormData(),
		parentKey: string = "",
		visited: WeakSet<any> = new WeakSet(),
	): FormData => {
		if (obj === null || obj === undefined) return formData;

		if (typeof obj !== "object") {
			formData.append(parentKey, obj.toString());
			return formData;
		}

		if (obj instanceof File || obj instanceof Blob) {
			formData.append(parentKey, obj);
			return formData;
		}

		if (obj instanceof Date) {
			formData.append(parentKey, obj.toISOString());
			return formData;
		}

		if (visited.has(obj)) return formData;
		visited.add(obj);

		if (Array.isArray(obj)) {
			obj.forEach((item, index) => {
				const itemKey = `${parentKey}[${index}]`;
				this.buildFormData(item, formData, itemKey, visited);
			});
			return formData;
		}

		Object.keys(obj).forEach((key) => {
			const value = obj[key];
			if (value === null || value === undefined) return;

			const nestedKey = parentKey ? `${parentKey}.${key}` : key;
			this.buildFormData(value, formData, nestedKey, visited);
		});

		return formData;
	};
}

export const http = new HttpService();

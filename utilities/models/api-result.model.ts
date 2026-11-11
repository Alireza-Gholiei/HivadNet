export interface ApiResult {
	IsSuccess: boolean;
	MetaData: MetaData;
}

export interface ApiResultWithData<T> {
	IsSuccess: boolean;
	Data: T;
	MetaData: MetaData;
}

export interface MetaData {
	Message: string;
	AppStatusCode: AppStatusCode;
}

export enum AppStatusCode {
	Success = 1,
	NotFound = 2,
	BadRequest = 3,
	LogicError = 4,
	UnAuthorize = 5,
	ServerError = 6,
}

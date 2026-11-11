export interface FormGetChildDto {
	Id: number;
	ParentId?: number;
	Name: string;
	HasChildren: boolean;
	Parent: number[];
	FormType: FormType;
}

export enum FormType {
	Menu = 1,
	Page = 2,
}

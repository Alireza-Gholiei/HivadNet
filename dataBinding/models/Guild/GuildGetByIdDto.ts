import { GuildFieldColumns } from "./GuildFieldColumnsDto";

export type GuildGetByIdDto = {
	Id: number;
	Name: string;
	Description: string;
	Fields: GuildGetByIdFieldsDto[] | null;
};

export type GuildGetByIdFieldsDto = {
	Id: number;
	FieldName: string;
	DataType: number;
	DataTypeName: string;
	IsRequired: boolean;
	Columns?: GuildFieldColumns[];
};

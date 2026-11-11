import { GuildFieldColumns } from "../GuildFieldColumnsDto";

export type GuildGroupGetFieldDto = {
	Id: number;
	FieldName: string;
	DataType: number;
	IsRequired: boolean;
	Columns?: GuildFieldColumns[];
};

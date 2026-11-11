import { GuildFieldColumns } from "../Guild/GuildFieldColumnsDto";

export type CustomerGetGuildsFieldValue = {
	FieldId: number;
	Value: string | null;
};

export type CustomerGetGuildsFieldDto = {
	FieldName: string | null;
	FieldId: number;
	Value: string | null;
	DataType: number;
	IsRequired: boolean | null;
	Columns?: GuildFieldColumns[] | null;
};

export type CustomerGetGuildsDto = {
	CustomerId: number;
	GuildId: number;
	GuildGroupId: number;
	CustomerFullName: string;
	GuildGroupName: string;
	GuildName: string;
	Fields: CustomerGetGuildsFieldDto[];
};

export const getFieldDisplayValue = (field: CustomerGetGuildsFieldDto): string => {
	if (field.Value === null || field.Value.trim() === "") return "—";

	switch (field.DataType) {
		case 3:
			if (field.Value === "true" || field.Value === "1") return "بله";
			if (field.Value === "false" || field.Value === "0") return "خیر";
			return field.Value;

		default:
			return field.Value;
	}
};

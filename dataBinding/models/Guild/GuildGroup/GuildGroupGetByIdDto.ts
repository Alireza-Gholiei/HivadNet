import { GuildFieldColumns } from "../GuildFieldColumnsDto";

export type GuildGroupGetByIdDto = {
	Id: number;
	GuildId: number;
	Name: string;
	IsActive: boolean;
	Reminder: GuildGroupGetByIdReminderDto | null;
	Fields: GuildGroupGetByIdFieldsDto[] | null;
};

export type GuildGroupGetByIdReminderDto = {
	Id: number;
	SmsTemplateId: number;
	IsActive: boolean;
	Type: number;
	DayOfMonth: number;
	TimeOfDay: string;
};

export type GuildGroupGetByIdFieldsDto = {
	Id: number;
	FieldName: string;
	DataType: number;
	DataTypeName: string;
	IsRequired: boolean;
	Columns?: GuildFieldColumns[];
};

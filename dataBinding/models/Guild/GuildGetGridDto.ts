export type GuildGetGridDto = {
	Id: number;
	Name: string;
	FieldsCount: number;
	Groups: GuildGetGroupsGridDto[];
};

export type GuildGetGroupsGridDto = {
	Id: number;
	Name: string;
	IsReminder: boolean;
	ReminderType: string;
	FieldsCount: number;
};

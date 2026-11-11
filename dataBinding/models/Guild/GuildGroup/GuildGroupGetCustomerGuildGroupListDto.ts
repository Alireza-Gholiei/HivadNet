export type GuildGroupGetCustomerGuildGroupListDto = {
	Id: number;
	Name: string;
	HasPeriodicOperation: boolean;
	PerformedPeriods: GuildGroupPerformedPeriodDto[];
};

export type GuildGroupPerformedPeriodDto = {
	PersianYear: number;
	PersianMonth: number;
	IsDone: boolean;
	Title?: string | null;
	DoneAt?: string | null;
};

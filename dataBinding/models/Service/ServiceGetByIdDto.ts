export interface ServiceGetByIdDto {
	Id: number;
	CustomerId: number;
	Description?: string;
	CreateDate?: string;
	Items: ServiceGetByIdItemDto[];
}

export interface ServiceGetByIdItemDto {
	Id: number;
	GuildId: number;
	GuildName: string;
	GuildGroupId: number;
	ServiceCostId: number;
	RepresentativeCustomerId?: number | null;
	Quantity: number;
	UnitPrice: number;
	Discount: number;
	Description?: string;
	PerformedPeriods: ServiceGetByIdItemPerformedPeriodDto[];
}

export interface ServiceGetByIdItemPerformedPeriodDto {
	PersianYear: number;
	PersianMonth: number;
}

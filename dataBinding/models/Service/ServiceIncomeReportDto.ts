export type ServiceIncomeReportDto = {
	Id?: number;
	PeriodKey: string;
	PeriodTitle: string;
	TotalPrice: number;
	TotalDiscount: number;
	TotalEffectiveAmount: number;
	ServiceCount: number;
};

enum IncomeReportAggregationType {
	Daily = 1,
	Monthly = 2,
	Yearly = 3,
}

export type ServiceIncomeReportQry = {
	FromDate?: string | Date | null;
	ToDate?: string | Date | null;
	Aggregation?: IncomeReportAggregationType;
	CustomerId?: number | null;
	GuildId?: number | null;
	GuildGroupId?: number | null;
};

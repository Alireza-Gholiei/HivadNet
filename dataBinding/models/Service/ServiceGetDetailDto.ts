export type ServiceGetDetailDto = {
	Id: number;
	CustomerId: number;
	CustomerFullName: string;
	Description?: string;
	CreateDate?: string;
	Items: ServiceGetDetailItemDto[];
};

type ServiceGetDetailItemDto = {
	Id: number;
	GuildId: number;
	GuildName: string;
	GuildGroupId: number;
	GuildGroupName: string;
	ServiceCostId: number;
	ServiceCostTitle: string;
	RepresentativeCustomerId?: number | null;
	RepresentativeCustomerName?: string | null;
	Quantity: number;
	UnitPrice: number;
	Discount: number;
	Description?: string;
};

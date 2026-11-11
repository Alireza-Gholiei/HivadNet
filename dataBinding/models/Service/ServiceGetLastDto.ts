export interface ServiceGetLastDto {
	Description?: string | undefined;
	Items: ServiceGetLastItemDto[];
}

export interface ServiceGetLastItemDto {
	GuildId: number;
	GuildGroupId: number;
	ServiceCostId: number;
	RepresentativeCustomerId?: number | null;
	Quantity: number;
	UnitPrice: number;
	Discount: number;
	Description?: string | null;
}

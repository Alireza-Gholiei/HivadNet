export interface CustomerGetDetailDto {
	Id: number;
	FirstName: string;
	LastName: string;
	PhoneNumber: string;
	NationalCode: string;
	Job?: string | null;
	Address?: string | null;
	Type: number;
	TypeName: string;
	IsActive: boolean;
	Transaction?: CustomerGetDetailTransactionDto;
	GuildGroups?: CustomerGetDetailGuildGroupDto[];
	Representatives?: CustomerGetDetailRepresentativesDto[];
	MainRepresentatives?: CustomerGetDetailRepresentativesDto[];
}

export interface CustomerGetDetailGuildGroupDto {
	Id: number;
	Name: string;
}

export interface CustomerGetDetailTransactionDto {
	Id: number;
	CurrentBalance: number;
}

export interface CustomerGetDetailRepresentativesDto {
	Id: number;
	Name: string;
	GuildName: string;
	GuildGroupName: string;
}

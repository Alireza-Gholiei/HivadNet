export type CustomerGetEditDto = {
	Id: number;
	FirstName: string;
	LastName: string;
	PhoneNumber: string;
	NationalCode: string;
	Job?: string;
	Address?: string;
	Type: number;
	TypeName: string;
	IsActive: boolean;
};

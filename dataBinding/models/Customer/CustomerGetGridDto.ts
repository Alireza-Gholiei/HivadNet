export type CustomerGetGridDto = {
	Id: number;
	FullName: string;
	FirstName: string;
	LastName: string;
	NationalCode: string;
	PhoneNumber: string;
	Job?: string;
	Address?: string;
	Type: CustomerType;
	TypeName: string;
	IsActive: boolean;
	ToggleRepPanel: boolean;
};

export enum CustomerType {
	/// <summary>
	/// مشتری عادی
	/// </summary>
	Regular = 1,
	/// <summary>
	/// مشتری ویژه
	/// </summary>
	Vip = 2,
}

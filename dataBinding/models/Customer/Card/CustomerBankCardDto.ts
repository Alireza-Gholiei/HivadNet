export interface CustomerBankCardDto {
	Id: number;

	CardNumber: string;

	AccountNumber?: string | null;

	ShebaNumber?: string | null;

	OwnerName?: string | null;

	ExpireMonth: string;

	ExpireYear: string;

	Cvv2: string;

	// IsDefault: boolean;
}

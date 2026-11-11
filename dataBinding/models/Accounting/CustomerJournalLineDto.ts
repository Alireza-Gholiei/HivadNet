export interface CustomerJournalLineDto {
	LineId: number;
	JournalEntryId: number;
	EntryNo: string;
	EntryDate: string;
	EntryType: string;
	EntryDescription: string;
	Debit: number;
	Credit: number;
	SignedAmount: number;
	AccountTitle: string;
	LineDescription?: string;
	PaymentMethodName?: string;
}

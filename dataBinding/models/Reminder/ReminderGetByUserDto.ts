export type ReminderGetByUserDto = {
	Id: number;
	UserFullName: string;
	Title: string;
	Description: string;
	Type: number;
	TypeName: string;
	EndDate: string;
	IsCompleted: boolean;
};

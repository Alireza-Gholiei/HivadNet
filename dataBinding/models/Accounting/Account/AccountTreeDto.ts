export interface AccountTreeDto {
	Id: number;
	Code: string;
	Title: string;
	Level: number;
	LevelName: string;
	IsSelectable: boolean;
	Children: AccountTreeDto[];
}

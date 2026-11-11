export type RoleGetNameDto = {
	Id: number;
	ParentId: number;
	Name: string;
	AccessAll: boolean;
	Forms: [number];
};

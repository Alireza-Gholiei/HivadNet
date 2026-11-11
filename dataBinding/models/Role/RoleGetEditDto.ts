export type RoleGetEditDto = {
	Id: number;
	ParentId: number;
	Name: string;
	AccessAll: boolean;
	Forms: [number];
};

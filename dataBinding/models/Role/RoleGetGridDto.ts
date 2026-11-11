export type RoleGetGridDto = {
	Id: number;
	AccessAll: boolean;
	Name: string;
	UserRolesCount: number;
	RoleParentName: string;
	RoleChildrenCount: number;
};

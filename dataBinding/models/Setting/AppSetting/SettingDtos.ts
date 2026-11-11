import z from "zod";

export const SettingAddSchema = z.object({
	Name: z.string().min(1, "نام الزامی است"),
	Phone: z.string().min(1, "شماره تماس الزامی است"),
	CardNumber: z.string().nullable(),
});

export type SettingAddDto = z.infer<typeof SettingAddSchema>;

export const SettingEditSchema = z.object({
	Id: z.number().min(1, "شناسه الزامی است"),
	Name: z.string().min(1, "نام الزامی است"),
	Phone: z.string().min(1, "شماره تماس الزامی است"),
	CardNumber: z.string().nullable(),
});

export type SettingEditDto = z.infer<typeof SettingEditSchema>;

export interface SettingGetByIdDto {
	Id: number;
	Name: string;
	Phone: string;
	CardNumber?: string;
}

export interface SettingGetGridDto {
	Id: number;
	Name: string;
	Phone: string;
	CardNumber?: string;
}

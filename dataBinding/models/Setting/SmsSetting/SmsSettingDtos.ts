import z from "zod";

export const SmsSettingAddSchema = z.object({
	Name: z.string().min(1, "نام الزامی است"),
	Type: z.number("نوع الزامی است"),
	Number: z.string().min(1, "شماره الزامی است"),
	Username: z.string().min(1, "نام کاربری الزامی است"),
	Password: z.string().min(1, "رمز عبور الزامی است"),
	IsDefault: z.boolean(),
});

export type SmsSettingAddDto = z.infer<typeof SmsSettingAddSchema>;

export const SmsSettingEditSchema = z.object({
	Id: z.number().min(1, "شناسه الزامی است"),
	Name: z.string().min(1, "نام الزامی است"),
	Type: z.number("نوع الزامی است"),
	Number: z.string().min(1, "شماره الزامی است"),
	Username: z.string().min(1, "نام کاربری الزامی است"),
	Password: z.string().min(1, "رمز عبور الزامی است"),
	IsDefault: z.boolean(),
});

export type SmsSettingEditDto = z.infer<typeof SmsSettingEditSchema>;

export interface SmsSettingGetByIdDto {
	Id: number;
	Name: string;
	Type: number;
	Number: string;
	Username: string;
	Password: string;
	IsDefault: boolean;
}

export interface SmsSettingGetGridDto {
	Id: number;
	Name: string;
	Number: string;
	Username: string;
	Type: string;
	IsDefault: string;
}

export interface SmsSettingGetTypesDto {
	Id: number;
	Name: string;
}

import z from "zod";

export const SmsAddSchema = z.object({
	Name: z.string().min(1, "عنوان الزامی است"),
	Description: z.string().nullable(),
	MessageText: z.string("متن پیامک الزامی است").min(1, "متن پیامک الزامی است"),
	ScheduledDate: z.date("تاریخ ارسال الزامی است").min(1, "تاریخ ارسال الزامی است"),
	ScheduledTime: z.string("زمان ارسال الزامی است").min(1, "زمان ارسال الزامی است"),
	CustomerIds: z.array(z.number()),
});

export type SmsAddDto = z.infer<typeof SmsAddSchema>;

export const SmsAddCustomSchema = z.object({
	Name: z.string().min(1, "عنوان الزامی است"),
	Description: z.string().nullable(),
	MessageText: z.string("متن پیامک الزامی است").min(1, "متن پیامک الزامی است"),
	CustomerIds: z.array(z.number()),
});

export type SmsAddCustomDto = z.infer<typeof SmsAddCustomSchema>;

export const SmsAddByGuildSchema = z.object({
	Name: z.string().min(1, "عنوان الزامی است"),
	Description: z.string().nullable(),
	MessageText: z.string("متن پیامک الزامی است").min(1, "متن پیامک الزامی است"),
	ScheduledDate: z.date("تاریخ ارسال الزامی است").min(1, "تاریخ ارسال الزامی است"),
	ScheduledTime: z.string("زمان ارسال الزامی است").min(1, "زمان ارسال الزامی است"),
	GuildId: z.number().min(1, "سامانه الزامی است"),
	GuildGroupId: z.number(),
});

export type SmsAddByGuildDto = z.infer<typeof SmsAddByGuildSchema>;

export const SmsAddCustomersSchema = z.object({
	Id: z.number(),
	CustomerIds: z.array(z.number()),
});

export type SmsAddCustomersDto = z.infer<typeof SmsAddCustomersSchema>;

export interface SmsGetGridDto {
	Id: number;
	SmsGroupName: string;
	Status: string;
	MessageText: string;
	ScheduledDate: string;
	ItemsCount: number;
}

export interface SmsGetDetailsDto {
	Id: number;
	SmsGroupName: string;
	Status: string;
	MessageText: string;
	ScheduledDate: string;
	ItemsCount: number;
}

export interface SmsGetDetailsItemDto {
	Id: number;
	Status: string;
	FirstName: string;
	LastName: string;
	PhoneNumber: string;
}

export interface SmsGetActiveListDto {
	Id: number;
	Name: string;
}

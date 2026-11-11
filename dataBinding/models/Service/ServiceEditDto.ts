import { z } from "zod";

export const ServiceEditItemPerformedPeriodSchema = z.object({
	PersianYear: z
		.number("سال انجام خدمت نامعتبر است")
		.int("سال انجام خدمت باید عدد صحیح باشد")
		.min(1300, "سال انجام خدمت معتبر نیست")
		.max(1600, "سال انجام خدمت معتبر نیست"),
	PersianMonth: z
		.number("ماه انجام خدمت نامعتبر است")
		.int("ماه انجام خدمت باید عدد صحیح باشد")
		.min(1, "ماه انجام خدمت باید بین ۱ تا ۱۲ باشد")
		.max(12, "ماه انجام خدمت باید بین ۱ تا ۱۲ باشد"),
});

export const ServiceEditItemSchema = z.object({
	Id: z.number().nullable(),
	GuildId: z.number("سامانه نامعتبر است").min(1, "انتخاب سامانه الزامی است"),
	GuildGroupId: z.number("گروه سامانه نامعتبر است").min(1, "انتخاب گروه سامانه الزامی است"),
	ServiceCostId: z.number("هزینه خدمت نامعتبر است").min(1, "انتخاب هزینه خدمت الزامی است"),
	RepresentativeCustomerId: z.number().nullable(),
	Quantity: z.number("تعداد نامعتبر است").min(1, "تعداد باید بیشتر از صفر باشد"),
	UnitPrice: z.number("مبلغ واحد نامعتبر است").min(0, "مبلغ واحد نمی‌تواند منفی باشد"),
	Discount: z.number("تخفیف نامعتبر است").min(0, "تخفیف نمی‌تواند منفی باشد"),
	Description: z.string().optional(),
	PerformedPeriods: z.array(ServiceEditItemPerformedPeriodSchema),
});

export const ServiceEditSchema = z.object({
	Id: z.number("شناسه سرویس نامعتبر است").min(1, "انتخاب شناسه سرویس الزامی است"),
	CustomerId: z.number("مشتری نامعتبر است").min(1, "انتخاب مشتری الزامی است"),
	Description: z.string().optional(),
	Items: z.array(ServiceEditItemSchema).min(1, "حداقل یک آیتم برای خدمت الزامی است"),
});

export type ServiceEditItemPerformedPeriodDto = z.infer<typeof ServiceEditItemPerformedPeriodSchema>;
export type ServiceEditItemDto = z.infer<typeof ServiceEditItemSchema>;
export type ServiceEditDto = z.infer<typeof ServiceEditSchema>;

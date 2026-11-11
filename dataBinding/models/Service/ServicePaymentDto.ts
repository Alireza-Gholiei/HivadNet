import { z } from "zod";

export const ServicePaymentSchema = z.object({
	ServiceId: z.number("خدمت نامعتبر است").min(1, "انتخاب خدمت الزامی است"),
	CustomerId: z.number("مشتری نامعتبر است").min(1, "انتخاب مشتری الزامی است"),
	Amount: z.number("مبلغ پرداخت نامعتبر است").min(0, "مبلغ پرداخت نمی‌تواند منفی باشد"),
	Method: z.number("نوع پرداخت نامعتبر است").min(0, "نوع پرداخت نمی‌تواند منفی باشد"),
});

export type ServicePaymentDto = z.infer<typeof ServicePaymentSchema>;

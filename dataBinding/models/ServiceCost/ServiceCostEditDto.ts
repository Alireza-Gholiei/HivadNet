import { z } from "zod";

export const ServiceCostEditSchema = z.object({
    Id: z.number(),
    Title: z.string().min(1, "وارد کردن عنوان الزامی است"),
    Description: z.string().optional(),
    Price: z.number("مبلغ باید عدد باشد").min(0, "مبلغ نمی‌تواند منفی باشد"),
    AllowCustomPrice: z.boolean(),
    IsActive: z.boolean(),
});

export type ServiceCostEditDto = z.infer<typeof ServiceCostEditSchema>;
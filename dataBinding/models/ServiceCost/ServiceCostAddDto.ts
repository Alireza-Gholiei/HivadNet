import z from "zod";

export const serviceCostSchema = z.object({
    Title: z.string("عنوان الزامی است"),
    Price: z.number("مبلغ الزامی است"),
    Description: z.string().optional(),
    AllowCustomPrice: z.boolean(),
});

export type ServiceCostAddDto = z.infer<typeof serviceCostSchema>;

import z from "zod";

export const CustomerRepresentativeAddByIdSchema = z.object({
    GuildGroupId: z.number("گروه سامانه را انخاب کنید"),
    CustomerId: z.number("مشتری را انخاب کنید"),
    RepresentativeCustomerId: z.number("مشتری نماینده را انخاب کنید"),
});

export type CustomerRepresentativeAddByIdDto = z.infer<typeof CustomerRepresentativeAddByIdSchema>;
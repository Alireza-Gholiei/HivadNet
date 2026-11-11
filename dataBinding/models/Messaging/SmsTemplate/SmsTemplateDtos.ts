import { z } from "zod";

export const SmsTemplateAddSchema = z.object({
	Title: z.string().min(1, "عنوان قالب الزامی است"),
	Content: z.string().min(1, "متن قالب الزامی است"),
});

export type SmsTemplateAddDto = z.infer<typeof SmsTemplateAddSchema>;

export const SmsTemplateEditSchema = z.object({
	Id: z.number().min(1, "عنوان قالب الزامی است"),
	Title: z.string().min(1, "عنوان قالب الزامی است"),
	Content: z.string().min(1, "متن قالب الزامی است"),
	IsActive: z.boolean(),
});

export type SmsTemplateEditDto = z.infer<typeof SmsTemplateEditSchema>;

export interface SmsTemplateVariableDto {
	Placeholder: string;
	Title: string;
}

export interface SmsTemplateGetByIdDto {
	Id: number;
	Title: string;
	Content: string;
	IsActive: boolean;
}

export interface SmsTemplateGetGridDto {
	Id: number;
	Title: string;
	IsActive: boolean;
}

export type SmsTemplateRequestPreviewDto = {
	CustomerId: number;
	TemplateBody: string;
	Values: Record<string, string>;
};

export interface SmsTemplateGetPreviewDto {
	TemplateBody: string;
	RenderedBody: string;
	Placeholders: string[];
}

export interface SmsTemplateGetToUseDto {
	Id: number;
	Title: string;
	Content: string;
	CustomVariable: string[];
}
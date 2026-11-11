"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import SmsTempSelector from "@/components/sms/SmsTempSelector";
import { SmsAddCustomDto, SmsAddCustomSchema } from "@/dataBinding/models/Messaging/Sms/SmsDtos";
import {
	SmsTemplateGetGridDto,
	SmsTemplateGetToUseDto,
	SmsTemplateRequestPreviewDto,
} from "@/dataBinding/models/Messaging/SmsTemplate/SmsTemplateDtos";
import { SmsService } from "@/dataBinding/services/Messaging/Sms/SmsService";
import { SmsTemplateService } from "@/dataBinding/services/Messaging/SmsTemplate/SmsTemplateService";
import { Button } from "@/utilities/components/ui/button";
import { PageCard, PageCardContent } from "@/utilities/components/ui/card";
import { Messenger } from "@/utilities/Messenger";
import { Input } from "@/utilities/components/ui/input";

interface SmsSendWithTemplateProps {
	onClose: () => void;
	customerId: number;
}

export default function SmsSendWithTemplateForm({ onClose, customerId }: SmsSendWithTemplateProps) {
	const [template, setTemplate] = useState<SmsTemplateGetToUseDto | null>(null);
	const [manualInputs, setManualInputs] = useState<Record<string, string>>({});
	const [previewText, setPreviewText] = useState<string>("");
	const [isPreviewLoading, setIsPreviewLoading] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [selectedTemplate, setSelectedTemplate] = useState<SmsTemplateGetGridDto | null>(null);

	const {
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<SmsAddCustomDto>({
		resolver: zodResolver(SmsAddCustomSchema),
		defaultValues: {
			Name: "",
			Description: null,
			MessageText: "",
			CustomerIds: [customerId],
		},
	});

	useEffect(() => {
		const fetchTemplate = async () => {
			setPreviewText("");
			setIsLoading(true);

			try {
				const data = await SmsTemplateService.GetTemplateToUse(selectedTemplate?.Id ?? 0);

				if (data) {
					setTemplate(data);
					setValue("Name", data.Title, { shouldValidate: true });

					const initialInputs: Record<string, string> = {};

					data.CustomVariable.forEach((variable) => {
						initialInputs[variable] = "";
					});

					setManualInputs(initialInputs);
				}
			} catch (error) {
				console.error("خطا در دریافت قالب", error);
				Messenger.errorMessage("خطا در دریافت اطلاعات قالب");
			} finally {
				setIsLoading(false);
			}
		};

		if (selectedTemplate) {
			void fetchTemplate();
		} else {
			setTemplate(null);
			setManualInputs({});
			setPreviewText("");
		}
	}, [selectedTemplate, setValue]);

	const handleInputChange = (variableName: string, value: string) => {
		setManualInputs((prev) => ({
			...prev,
			[variableName]: value,
		}));
	};

	useEffect(() => {
		if (!template?.Content) return;

		const delayDebounceFn = setTimeout(() => {
			const runPreview = async () => {
				setIsPreviewLoading(true);

				try {
					const payload: SmsTemplateRequestPreviewDto = {
						CustomerId: customerId,
						TemplateBody: template.Content,
						Values: manualInputs,
					};

					const response = await SmsTemplateService.Preview(payload);

					setPreviewText(response.RenderedBody);
					setValue("MessageText", response.RenderedBody, { shouldValidate: true });
					setValue("CustomerIds", [customerId], { shouldValidate: true });
					setValue("Description", null);
				} catch (error) {
					console.error("خطا در دریافت پیش‌نمایش", error);
					setPreviewText("خطا در ارتباط با سرور برای پیش‌نمایش.");
				} finally {
					setIsPreviewLoading(false);
				}
			};

			void runPreview();
		}, 500);

		return () => clearTimeout(delayDebounceFn);
	}, [manualInputs, template, customerId, setValue]);

	const onSubmit = async (data: SmsAddCustomDto) => {
		if (!selectedTemplate) {
			Messenger.errorMessage("لطفا ابتدا یک قالب انتخاب کنید");
			return;
		}

		if (!previewText) {
			Messenger.errorMessage("لطفا منتظر آماده سازی قالب پیامک باشید");
			return;
		}

		const result = await SmsService.Custom(data);

		if (result) {
			Messenger.successAlert();
			reset({
				Name: "",
				Description: null,
				MessageText: "",
				CustomerIds: [customerId],
			});
			setSelectedTemplate(null);
			onClose();
		}
	};

	return (
		<PageCard>
			<PageCardContent>
				<SmsTempSelector value={selectedTemplate} onChange={setSelectedTemplate} required />

				{isLoading ? (
					<div>در حال بارگذاری...</div>
				) : selectedTemplate?.Id ? (
					<div className="p-4 border rounded-lg shadow-sm bg-white" dir="rtl">
						<h2 className="text-xl font-bold mb-4">ارسال پیامک: {template?.Title}</h2>

						<form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-4">
							{template && template.CustomVariable.length > 0 && (
								<div className="p-4 bg-gray-50 rounded-md">
									<h3 className="font-semibold mb-3">مقادیر متغیرها را وارد کنید:</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{template.CustomVariable.map((variable) => (
											<Input
												key={variable}
												label={`متغیر ${variable}`}
												type="text"
												required
												value={manualInputs[variable] || ""}
												onChange={(e) => handleInputChange(variable, e.target.value)}
											/>
										))}
									</div>
								</div>
							)}

							<div className="mt-4 relative">
								<h3 className="text-sm font-semibold mb-2">پیش‌نمایش پیامک :</h3>

								{isPreviewLoading && (
									<div className="absolute top-10 left-4 text-sm text-blue-500">
										در حال به‌روزرسانی پیش‌نمایش...
									</div>
								)}

								<p
									className={`p-3 bg-blue-50 text-blue-900 rounded-md min-h-15 whitespace-pre-wrap transition-opacity duration-300 ${
										isPreviewLoading ? "opacity-50" : "opacity-100"
									}`}
								>
									{previewText || "در حال آماده‌سازی پیش نمایش..."}
								</p>
							</div>

							{errors.Name && <span className="text-red-500 text-sm block">{errors.Name.message}</span>}
							{errors.MessageText && (
								<span className="text-red-500 text-sm block">{errors.MessageText.message}</span>
							)}
							{errors.CustomerIds && (
								<span className="text-red-500 text-sm block">
									{errors.CustomerIds.message as string}
								</span>
							)}

							<Button type="submit" disabled={isSubmitting || isPreviewLoading} variant="submit">
								{isSubmitting ? "در حال ارسال..." : "تایید و ارسال پیامک"}
							</Button>
						</form>
					</div>
				) : (
					<div className="flex-1 flex flex-col justify-center items-center text-slate-400 py-12 bg-white rounded-lg border border-dashed border-slate-300">
						<FileText className="w-12 h-12 mb-3 opacity-50" />
						<p>ابتدا یک قالب انتخاب کنید</p>
					</div>
				)}
			</PageCardContent>
		</PageCard>
	);
}

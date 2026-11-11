"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FolderPlus, Send } from "lucide-react";
import { useForm } from "react-hook-form";

import CustomerMultiSelector from "@/components/customer/CustomerMultiSelector";
import HraderTitle from "@/components/Shared/HraderTitle";
import { SmsAddCustomDto, SmsAddCustomSchema } from "@/dataBinding/models/Messaging/Sms/SmsDtos";
import { SmsService } from "@/dataBinding/services/Messaging/Sms/SmsService";
import { Button } from "@/utilities/components/ui/button";
import { PageCard, PageCardContent, PageCardFooter } from "@/utilities/components/ui/card";
import { Messenger } from "@/utilities/Messenger";
import { Input } from "@/utilities/components/ui/input";
import { Textarea } from "@/utilities/components/ui/textarea";

export default function SmsAddCustomForm() {
	const {
		register,
		handleSubmit,
		reset,
		setValue,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<SmsAddCustomDto>({
		resolver: zodResolver(SmsAddCustomSchema),
		defaultValues: {
			Name: "",
			Description: null,
			MessageText: "",
			CustomerIds: [],
		},
	});

	const onSubmit = async (data: SmsAddCustomDto) => {
		const result = await SmsService.Custom(data);

		if (result) {
			Messenger.successAlert("پیامک با موفقیت زمان‌بندی شد!");
			reset({ Name: "", Description: null, MessageText: "", CustomerIds: [] });
		}
	};

	return (
		<PageCard>
			<HraderTitle title="ارسال پیامک" description="ارسال دستی پیامک به مخاطبان" icon={<Send />} />

			<form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-4" dir="rtl">
				<PageCardContent>
					<div>
						<CustomerMultiSelector
							valueIds={watch("CustomerIds") || []}
							onChange={(customers) =>
								setValue(
									"CustomerIds",
									customers.map((x) => x.Id),
								)
							}
							label="انتخاب مشتریان"
							required
						/>

						{errors.CustomerIds && (
							<p className="text-rose-500 text-sm mt-1.5 font-medium">{errors.CustomerIds.message}</p>
						)}
					</div>

					<Input
						label="عنوان پیامک"
						schema={SmsAddCustomSchema}
						error={errors.Name?.message}
						icon={<FolderPlus className="h-5 w-5" />}
						placeholder="مثال: اطلاع‌رسانی به اعضای صنف"
						{...register("Name")}
					/>

					<Textarea
						label="توضیحات"
						schema={SmsAddCustomSchema}
						error={errors.Description?.message}
						placeholder="توضیحات اختیاری..."
						rows={2}
						textareaClassName="resize-none"
						{...register("Description")}
					/>

					<Textarea
						label="متن پیامک"
						schema={SmsAddCustomSchema}
						error={errors.MessageText?.message}
						placeholder="متن پیامک خود را اینجا بنویسید..."
						rows={5}
						textareaClassName="resize-none"
						{...register("MessageText")}
					/>
				</PageCardContent>

				<PageCardFooter>
					<Button type="submit" disabled={isSubmitting} variant="submit">
						{isSubmitting ? "در حال ثبت..." : "ثبت و زمان‌بندی پیامک"}
					</Button>
				</PageCardFooter>
			</form>
		</PageCard>
	);
}

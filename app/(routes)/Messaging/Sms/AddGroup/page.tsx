"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FolderPlus } from "lucide-react";
import { useForm } from "react-hook-form";

import CustomerMultiSelector from "@/components/customer/CustomerMultiSelector";
import HraderTitle from "@/components/Shared/HraderTitle";
import { SmsAddDto, SmsAddSchema } from "@/dataBinding/models/Messaging/Sms/SmsDtos";
import { SmsService } from "@/dataBinding/services/Messaging/Sms/SmsService";
import PersianDatePicker from "@/utilities/components/datepicker/persian-date-picker";
import PersianTimePicker from "@/utilities/components/datepicker/persian-time-picker";
import { Button } from "@/utilities/components/ui/button";
import { PageCard, PageCardContent, PageCardFooter } from "@/utilities/components/ui/card";
import { Messenger } from "@/utilities/Messenger";
import { Input } from "@/utilities/components/ui/input";
import { Textarea } from "@/utilities/components/ui/textarea";

interface SmsAddFormProps {}

export default function SmsAddForm({}: SmsAddFormProps) {
	const {
		register,
		handleSubmit,
		setValue,
		control,
		reset,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<SmsAddDto>({
		resolver: zodResolver(SmsAddSchema),
		defaultValues: {
			Name: "",
			Description: null,
			MessageText: "",
		},
	});

	const onSubmit = async (data: SmsAddDto) => {
		const result = await SmsService.Add(data);

		if (result) {
			Messenger.successAlert("پیامک با موفقیت زمان‌بندی شد!");
			reset({ Name: "", Description: null, MessageText: "", CustomerIds: [] });
		}
	};

	return (
		<PageCard>
			<HraderTitle title="ایجاد گروه پیامکی" description="ایجاد و مدیریت گروه‌های پیامکی" icon={<FolderPlus />} />
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
						schema={SmsAddSchema}
						error={errors.Name?.message}
						icon={<FolderPlus className="h-5 w-5" />}
						placeholder="مثال: اطلاع‌رسانی به اعضای صنف"
						{...register("Name")}
					/>

					<Textarea
						label="توضیحات"
						schema={SmsAddSchema}
						error={errors.Description?.message}
						placeholder="توضیحات اختیاری..."
						rows={2}
						textareaClassName="resize-none"
						{...register("Description")}
					/>

					<Textarea
						label="متن پیامک"
						schema={SmsAddSchema}
						error={errors.MessageText?.message}
						placeholder="متن پیامک خود را اینجا بنویسید..."
						rows={5}
						textareaClassName="resize-none"
						{...register("MessageText")}
					/>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label
								htmlFor="ScheduledDate"
								className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-1"
							>
								تاریخ ارسال
							</label>
							<PersianDatePicker<SmsAddDto> control={control} name="ScheduledDate" required />
						</div>

						<div>
							<label
								htmlFor="ScheduledTime"
								className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-1"
							>
								زمان ارسال
							</label>
							<PersianTimePicker<SmsAddDto> control={control} name="ScheduledTime" required />
						</div>
					</div>
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

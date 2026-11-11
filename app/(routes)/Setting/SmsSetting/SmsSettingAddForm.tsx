"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
	SmsSettingAddDto,
	SmsSettingAddSchema,
	SmsSettingGetTypesDto,
} from "@/dataBinding/models/Setting/SmsSetting/SmsSettingDtos";
import { SmsSettingService } from "@/dataBinding/services/Setting/SmsSetting/SmsSettingService";
import { Button } from "@/utilities/components/ui/button";
import { PageCard, PageCardContent, PageCardFooter } from "@/utilities/components/ui/card";
import { Input } from "@/utilities/components/ui/input";
import { Select } from "@/utilities/components/ui/select";
import { Checkbox } from "@/utilities/components/ui/checkbox";

type SmsSettingAddFormProps = {
	onSuccess: () => void;
	onClose: () => void;
};

export default function SmsSettingAddForm({ onSuccess, onClose }: SmsSettingAddFormProps) {
	const [types, setTypes] = useState<SmsSettingGetTypesDto[]>([]);

	const {
		register,
		handleSubmit,
		reset,
		control,
		formState: { errors, isSubmitting },
	} = useForm<SmsSettingAddDto>({
		resolver: zodResolver(SmsSettingAddSchema),
		defaultValues: {
			Name: "",
			Type: 0,
			Number: "",
			Username: "",
			Password: "",
			IsDefault: false,
		},
	});

	useEffect(() => {
		void fetchData();
	}, []);

	const fetchData = async () => {
		const result = await SmsSettingService.GetTypes();
		if (result) {
			setTypes(result);
		}
	};

	const onSubmit = async (data: SmsSettingAddDto) => {
		try {
			const result = await SmsSettingService.Add(data);

			if (result) {
				reset();
				if (onSuccess) onSuccess();
				onClose();
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<PageCard>
			<form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="p-6">
				<PageCardContent>
					<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
						<Input
							label="نام"
							type="text"
							schema={SmsSettingAddSchema}
							error={errors.Name?.message}
							placeholder="مثلاً پنل اصلی پیامک"
							disabled={isSubmitting}
							{...register("Name")}
						/>

						<div>
							<Controller
								control={control}
								name="Type"
								render={({ field }) => (
									<Select
										label="نوع"
										value={field.value || null}
										onValueChange={(value) => {
											field.onChange(Number(value ?? 0));
										}}
										options={types.map((type) => ({
											label: type.Name,
											value: type.Id,
										}))}
										placeholder="انتخاب نوع"
										clearable
										disabled={isSubmitting || types.length === 0}
										schema={SmsSettingAddSchema}
										error={errors.Type?.message}
									/>
								)}
							/>
						</div>

						<Input
							label="شماره"
							type="text"
							schema={SmsSettingAddSchema}
							error={errors.Number?.message}
							placeholder="3000xxxx"
							disabled={isSubmitting}
							dir="ltr"
							{...register("Number")}
						/>

						<Input
							label="نام کاربری"
							type="text"
							schema={SmsSettingAddSchema}
							error={errors.Username?.message}
							placeholder="نام کاربری پنل"
							disabled={isSubmitting}
							{...register("Username")}
						/>

						<Input
							label="رمز عبور"
							type="password"
							schema={SmsSettingAddSchema}
							error={errors.Password?.message}
							placeholder="رمز عبور پنل"
							disabled={isSubmitting}
							{...register("Password")}
						/>
					</div>

					<div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
						<Controller
							control={control}
							name="IsDefault"
							render={({ field }) => (
								<Checkbox
									label="تنظیم به عنوان پنل پیش‌فرض"
									description="در صورت فعال بودن، این پنل به عنوان تنظیمات پیش‌فرض ارسال پیامک استفاده می‌شود."
									checked={field.value}
									onChange={(e) => field.onChange(e.target.checked)}
									onBlur={field.onBlur}
									name={field.name}
									ref={field.ref}
									schema={SmsSettingAddSchema}
									error={errors.IsDefault?.message}
									disabled={isSubmitting}
									checkboxClassName="h-5 w-5 border-slate-300 peer-checked:border-indigo-600 peer-checked:bg-indigo-600 disabled:cursor-not-allowed"
								/>
							)}
						/>
					</div>
				</PageCardContent>
				<PageCardFooter className="mt-8 flex justify-end">
					<Button type="submit" disabled={isSubmitting} variant="submit">
						<Save className="h-4 w-4" />
						{isSubmitting ? "در حال ذخیره..." : "ذخیره"}
					</Button>
				</PageCardFooter>
			</form>
		</PageCard>
	);
}

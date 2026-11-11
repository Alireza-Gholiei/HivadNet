"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Briefcase, Fingerprint, Loader2, MapPin, Phone, Save, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { CustomerEditDto, CustomerEditSchema } from "@/dataBinding/models/Customer/CustomerEditDto";
import { CustomerGetTypesDto } from "@/dataBinding/models/Customer/CustomerGetTypesDto";
import { CustomerService } from "@/dataBinding/services/Customer/CustomerService";
import { Button } from "@/utilities/components/ui/button";
import { PageCard, PageCardContent, PageCardFooter } from "@/utilities/components/ui/card";
import { Input } from "@/utilities/components/ui/input";
import { Messenger } from "@/utilities/Messenger";
import { Select } from "@/utilities/components/ui/select";
import { Textarea } from "@/utilities/components/ui/textarea";
import { Checkbox } from "@/utilities/components/ui/checkbox";

export default function CustomerEdit({
	id,
	onClose,
	onSuccess,
}: {
	id: number;
	onClose: () => void;
	onSuccess: () => void;
}) {
	const [isLoadingData, setIsLoadingData] = useState(true);
	const [customerTypes, setCustomerTypes] = useState<CustomerGetTypesDto[]>([]);

	const {
		register,
		handleSubmit,
		reset,
		control,
		formState: { errors, isSubmitting },
	} = useForm<CustomerEditDto>({
		resolver: zodResolver(CustomerEditSchema),
		defaultValues: {
			Id: id,
			FirstName: "",
			LastName: "",
			PhoneNumber: "",
			NationalCode: "",
			Job: null,
			Address: null,
			Type: 0,
			IsActive: true,
		},
	});

	useEffect(() => {
		void (async () => {
			try {
				setIsLoadingData(true);

				const typesResult = await CustomerService.GetTypes();

				setCustomerTypes(typesResult);

				const result = await CustomerService.GetEdit(id);

				if (result) {
					reset({
						Id: result.Id,
						FirstName: result.FirstName ?? "",
						LastName: result.LastName ?? "",
						NationalCode: result.NationalCode ?? "",
						PhoneNumber: result.PhoneNumber ?? "",
						Job: result.Job ?? null,
						Address: result.Address ?? null,
						Type: result.Type ?? 0,
						IsActive: result.IsActive ?? true,
					});
				}
			} finally {
				setIsLoadingData(false);
			}
		})();
	}, [id, reset]);

	const onSubmit = async (data: CustomerEditDto) => {
		const result = await CustomerService.Edit(data);

		if (result) {
			Messenger.successAlert("ویرایش مشتری با موفقیت انجام شد");
			onSuccess();
			onClose();
		}
	};

	if (isLoadingData) {
		return (
			<div className="flex flex-col items-center justify-center space-y-3 py-10">
				<Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
				<p className="text-sm font-medium text-slate-500">در حال دریافت اطلاعات...</p>
			</div>
		);
	}

	return (
		<PageCard>
			<form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-5">
				<PageCardContent>
					<div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2">
						<Input
							label="نام"
							schema={CustomerEditSchema}
							error={errors.FirstName?.message}
							icon={<User className="h-5 w-5" />}
							placeholder="مثال: علی"
							{...register("FirstName")}
						/>

						<Input
							label="نام خانوادگی"
							schema={CustomerEditSchema}
							error={errors.LastName?.message}
							icon={<User className="h-5 w-5" />}
							placeholder="مثال: محمدی"
							{...register("LastName")}
						/>

						<Input
							label="شماره تماس"
							schema={CustomerEditSchema}
							error={errors.PhoneNumber?.message}
							icon={<Phone className="h-5 w-5" />}
							type="tel"
							dir="ltr"
							inputMode="tel"
							placeholder="09123456789"
							{...register("PhoneNumber")}
						/>

						<Input
							label="کد ملی"
							schema={CustomerEditSchema}
							error={errors.NationalCode?.message}
							icon={<Fingerprint className="h-5 w-5" />}
							type="text"
							inputMode="numeric"
							dir="ltr"
							placeholder="0123456789"
							{...register("NationalCode")}
						/>

						<Controller
							control={control}
							name="Type"
							render={({ field }) => (
								<Select
									label="نوع مشتری"
									name={field.name}
									value={field.value || null}
									onValueChange={(value) => field.onChange(value ?? 0)}
									onBlur={field.onBlur}
									placeholder="انتخاب نوع مشتری"
									searchPlaceholder="جستجوی نوع مشتری..."
									clearable
									schema={CustomerEditSchema}
									error={errors.Type?.message}
									options={customerTypes.map((type) => ({
										label: type.Name,
										value: type.Id,
									}))}
								/>
							)}
						/>

						<Input
							label="شغل"
							schema={CustomerEditSchema}
							error={errors.Job?.message}
							icon={<Briefcase className="h-5 w-5" />}
							placeholder="مثال: کارمند"
							{...register("Job")}
						/>

						<Textarea
							label="آدرس"
							schema={CustomerEditSchema}
							error={errors.Address?.message}
							icon={<MapPin className="h-5 w-5" />}
							placeholder="مثال: تهران - میدان فردوسی"
							rows={4}
							textareaClassName="min-h-28 resize-none bg-slate-50 focus:bg-white"
							{...register("Address")}
						/>

						<div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
							<Checkbox
								label="فعال"
								description="فعال یا غیرفعال بودن مشتری را مشخص کنید"
								schema={CustomerEditSchema}
								error={errors.IsActive?.message}
								checkboxClassName="border-slate-300 peer-checked:border-indigo-600 peer-checked:bg-indigo-600"
								{...register("IsActive")}
							/>
						</div>
					</div>
				</PageCardContent>

				<PageCardFooter className="mt-8 flex items-center gap-3 border-t border-slate-100 pt-4">
					<Button type="button" onClick={onClose} variant="secondary">
						انصراف
					</Button>

					<Button type="submit" disabled={isSubmitting} variant="submit">
						{isSubmitting ? (
							<>
								<Loader2 className="h-5 w-5 animate-spin" />
								در حال ذخیره...
							</>
						) : (
							<>
								<Save className="h-5 w-5" />
								ثبت تغییرات
							</>
						)}
					</Button>
				</PageCardFooter>
			</form>
		</PageCard>
	);
}
